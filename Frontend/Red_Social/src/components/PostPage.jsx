import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export default function PostPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await fetch(`${API_URL}/posts/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error("fetch post by id", err);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id]);

  if (loading) return <div>Cargando post…</div>;
  if (!post) return <div>Post no encontrado</div>;

  const lineas = (post.contenido || "").split("\n");
  const texto = lineas[0] || "";
  const imagen = lineas[1] || null;

  return (
    <div className="container mt-4">
      <article className="fb-card fb-post-page mx-auto">
        <div className="card-body">
          <div className="fb-post-header">
            <div>
              <div className="fb-post-author">{post.autor}</div>
              {post.fecha && (
                <div className="fb-post-date">
                  {new Date(post.fecha).toLocaleString()}
                </div>
              )}
            </div>
          </div>

          <div className="fb-post-content">
            <p className="fb-post-text">{texto}</p>
            {imagen && (
              <div className="fb-post-media">
                <img src={imagen} alt="post" />
              </div>
            )}
          </div>

          <div className="fb-post-footer justify-content-end">
            <button className="btn fb-btn" onClick={() => navigate("/")}>
              Regresar al inicio
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
