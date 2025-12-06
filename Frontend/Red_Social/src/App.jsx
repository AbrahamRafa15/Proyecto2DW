import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

function Navbar({ user, onSetUser }) {
  const [input, setInput] = useState("");

  const saveUser = (e) => {
    e.preventDefault();
    if (!input) return;
    sessionStorage.setItem("current_user", input);
    onSetUser(input);
  };

  const logout = () => {
    sessionStorage.removeItem("current_user");
    onSetUser(null);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div className="container">
        <a className="navbar-brand" href="#">Red Social</a>
        <div className="d-flex align-items-center gap-2">
          {user ? (
            <>
              <span className="me-2">Hola, <strong>{user}</strong></span>
              <button className="btn btn-outline-secondary btn-sm" onClick={logout}>Cerrar sesión</button>
            </>
          ) : (
            <form className="d-flex" onSubmit={saveUser}>
              <input className="form-control form-control-sm me-2" placeholder="Tu usuario" value={input} onChange={e => setInput(e.target.value)} />
              <button className="btn btn-primary btn-sm" type="submit">Entrar</button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}

function CreatePost({ onCreate, user }) {
  const [contenido, setContenido] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!contenido.trim()) return;
    setLoading(true);
    try {
      const body = { contenido, image_id: null };
      // send image URL as part of content or use image_id if you implement images
      const res = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user": user || "anonymous",
        },
        body: JSON.stringify({ ...body, contenido: contenido + (imageUrl ? `\n${imageUrl}` : "") }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const id = await res.json();
      setContenido("");
      setImageUrl("");
      onCreate && onCreate(id);
    } catch (err) {
      console.error("create post", err);
      alert("Error al crear el post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <form onSubmit={submit}>
          <div className="mb-2">
            <textarea className="form-control" placeholder="¿Qué piensas?" value={contenido} onChange={e => setContenido(e.target.value)} rows={3}></textarea>
          </div>
          <div className="mb-2 d-flex gap-2">
            <input className="form-control form-control-sm" placeholder="URL de imagen (opcional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
            <button className="btn btn-primary btn-sm" type="submit" disabled={loading || !user}>{loading ? 'Enviando...' : 'Publicar'}</button>
          </div>
          {!user && <div className="text-muted small">Debes iniciar sesión (usuario) para publicar. El header se enviará como <code>x-user</code>.</div>}
        </form>
      </div>
    </div>
  );
}

function Feed({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const cache = JSON.parse(localStorage.getItem("posts_cache") || "null");
    const cacheTs = localStorage.getItem("posts_cache_ts");

    const shouldUseCache = cache && cacheTs && (Date.now() - parseInt(cacheTs, 10) < 1000 * 60 * 5);

    async function load() {
      setLoading(true);
      if (shouldUseCache) {
        setPosts(cache);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/posts?limit=20`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        setPosts(data || []);
        localStorage.setItem("posts_cache", JSON.stringify(data || []));
        localStorage.setItem("posts_cache_ts", String(Date.now()));
      } catch (err) {
        console.error("fetch posts", err);
        const local = JSON.parse(localStorage.getItem("posts_cache") || "[]");
        setPosts(local);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => { mounted = false };
  }, []);

  if (loading) return <div>Cargando feed…</div>;

  return (
    <div>
      {posts.length === 0 && <div className="alert alert-secondary">No hay posts todavía.</div>}
      {posts.map(p => (
        <div className="card mb-3" key={p.id}>
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <strong>{p.autor}</strong>
                <div className="text-muted small">{new Date(p.fecha).toLocaleString()}</div>
              </div>
            </div>
            <p className="mt-2">{p.contenido}</p>
            {p.image_id && <img src={p.image_id} alt="" className="img-fluid rounded" />}
          </div>
        </div>
      ))}
    </div>
  );
}

function SpotifyWidget() {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/spotify/new-releases?limit=8`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        setReleases(data || []);
      } catch (err) {
        console.error("spotify", err);
        setReleases([]);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false };
  }, []);

  if (loading) return <div>Cargando releases de Spotify…</div>;

  return (
    <div className="card">
      <div className="card-body">
        <h6>Spotify - New releases</h6>
        {releases.map((r, i) => (
          <div key={i} className="mb-2">
            <a href={r.url} target="_blank" rel="noreferrer"><strong>{r.name}</strong></a>
            <div className="small text-muted">{r.artists.join(", ")} — {r.release_date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(sessionStorage.getItem("current_user"));

  return (
    <div>
      <Navbar user={user} onSetUser={setUser} />
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <CreatePost onCreate={() => {
              // invalidate cache and force fetch
              localStorage.removeItem("posts_cache");
              localStorage.removeItem("posts_cache_ts");
            }} user={user} />
            <Feed user={user} />
          </div>
          <div className="col-lg-4">
            <SpotifyWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
