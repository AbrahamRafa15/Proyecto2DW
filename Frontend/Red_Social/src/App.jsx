import React, { useEffect, useState } from "react";

import TopBar from "./components/TopBar";
import CenterFeed from "./components/CenterFeed";
import RightBar from "./components/RightBar";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export default function App() {
  // ===== Sesión =====
  const [user, setUser] = useState(sessionStorage.getItem("current_user"));
  const [userInput, setUserInput] = useState("");

  const onLogin = () => {
    const u = userInput.trim();
    if (!u) return;
    sessionStorage.setItem("current_user", u);
    setUser(u);
    setUserInput("");
  };

  const onLogout = () => {
    sessionStorage.removeItem("current_user");
    setUser(null);
  };

  // ===== Composer (ThinkBar) =====
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const canPost = Boolean(user);

  // ===== Feed =====
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const loadPosts = async () => {
    setLoadingPosts(true);

    const cache = JSON.parse(localStorage.getItem("posts_cache") || "null");
    const cacheTs = localStorage.getItem("posts_cache_ts");
    const shouldUseCache =
      cache && cacheTs && Date.now() - parseInt(cacheTs, 10) < 1000 * 60 * 5;

    if (shouldUseCache) {
      setPosts(cache);
      setLoadingPosts(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/posts?limit=20`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPosts(data || []);
      localStorage.setItem("posts_cache", JSON.stringify(data || []));
      localStorage.setItem("posts_cache_ts", String(Date.now()));
    } catch (err) {
      console.error("fetch posts", err);
      const local = JSON.parse(localStorage.getItem("posts_cache") || "[]");
      setPosts(local);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const onPublish = async () => {
    if (!user) return;

    const contenido = text.trim();
    if (!contenido) return;

    try {
      const payload = {
        contenido: contenido + (imageUrl ? `\n${imageUrl}` : ""),
        image_id: null,
      };

      const res = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user": user,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setText("");
      setImageUrl("");

      localStorage.removeItem("posts_cache");
      localStorage.removeItem("posts_cache_ts");
      await loadPosts();
    } catch (err) {
      console.error("create post", err);
      alert("Error al crear el post");
    }
  };

  return (
    <div>
      <div className="container">
        <TopBar
          user={user}
          userInput={userInput}
          setUserInput={setUserInput}
          onLogin={onLogin}
          onLogout={onLogout}
        />
      </div>

      <div className="container">
        <div className="row">
          {/* Centro */}
          <div className="col-12 col-lg-8">
            {loadingPosts ? (
              <div>Cargando feed…</div>
            ) : (
              <CenterFeed
                user={user}
                text={text}
                setText={setText}
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                canPost={canPost}
                onPublish={onPublish}
                posts={posts}
              />
            )}
          </div>

          {/* Derecha */}
          <div className="col-12 col-lg-4">
            <RightBar />
          </div>
        </div>
      </div>
    </div>
  );
}