import React, { useEffect, useState } from "react";

import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import "./App.css";

import TopBar from "./components/TopBar";
import CenterFeed from "./components/CenterFeed";
import RightBar from "./components/RightBar";
import LeftBar from "./components/LeftBar";
import PostPage from "./components/PostPage";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export default function App() {

  // ===== Estado de Health =====
  const [apiHealth, setApiHealth] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_URL}/health`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setApiHealth(data.status || "OK");
      } catch (err) {
        console.error("API health check failed:", err);
        setApiHealth("DOWN");
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 1000 * 60); // cada 1 min
    return () => clearInterval(interval);
  }, []);
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

  // ===== Tema (claro/oscuro) =====
const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

useEffect(() => {
  document.body.dataset.theme = theme; // "light" o "dark"
  localStorage.setItem("theme", theme);
}, [theme]);

const toggleTheme = () => {
  setTheme((t) => (t === "dark" ? "light" : "dark"));
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

  const onUpdatePost = async (postId) => {
  if (!user) return;

  const contenido = text.trim();
  if (!contenido) return;

  try {
    const payload = {
      contenido: contenido + (imageUrl ? `\n${imageUrl}` : ""),
      image_id: null,
    };

    const res = await fetch(`${API_URL}/posts/${postId}`, {
      method: "PATCH",
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
    console.error("update post", err);
    alert("Error al editar el post");
  }
  };

  const onDeletePost = async (postId) => {
  if (!user) return;
  if (!window.confirm("¿Eliminar este post?")) return;

  try {
    const res = await fetch(`${API_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: { "x-user": user },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    localStorage.removeItem("posts_cache");
    localStorage.removeItem("posts_cache_ts");
    await loadPosts();
  } catch (err) {
    console.error("delete post", err);
    alert("Error al eliminar el post");
  }
  };

  //Modo para editar
  const [editingPostId, setEditingPostId] = useState(null);

  const onStartEditPost = (post) => {
    setEditingPostId(post.id);
    const lineas = (post.contenido || "").split("\n");
    setText(lineas[0] || "");
    setImageUrl(lineas[1] || "");
  };

  const onCancelEdit = () => {
    setEditingPostId(null);
    setText("");
    setImageUrl("");
  };

  const onSubmitPost = async () => {
    if (editingPostId) return onUpdatePost(editingPostId);
    return onPublish();
  };


  return (
    <div>
      <TopBar
        user={user}
        userInput={userInput}
        setUserInput={setUserInput}
        onLogin={onLogin}
        onLogout={onLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      {/* Utilizarlo en caso de que se quiera ver visualmente el estado de la API
      {apiHealth && (
        <div style={{ padding: "0.5rem", textAlign: "center" }}>
          API Status: <strong style={{ color: apiHealth === "OK" ? "green" : "red" }}>
            {apiHealth}
          </strong>
        </div>
      )}
      */}
      <Routes>
        <Route path="/posts/:id" element={<PostPage user={user} />} />
        <Route
          path="/"
          element={
      <div className="container">
              <div className="row g-3">
                <div className="col-lg-3 d-none d-lg-block">
                  <LeftBar />
                </div>

                <div className="col-12 col-lg-6">
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
                      onUpdatePost={onUpdatePost}
                      onDeletePost={onDeletePost}
                      editingPostId={editingPostId}
                      onStartEditPost={onStartEditPost}
                      onCancelEdit={onCancelEdit}
                      onSubmitPost={onSubmitPost}
                    />
                  )}
                </div>

                <div className="col-lg-3 d-none d-lg-block">
                  <RightBar apiUrl={API_URL} />
                </div>
              </div>
            </div>
          }
        />

        <Route
          path="*"
          element={<div className="container mt-4">Página no encontrada</div>}
        />
      </Routes>
    </div>
  );
}
