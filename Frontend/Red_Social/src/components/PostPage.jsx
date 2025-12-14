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
      <div className="fb-card">
        <div className="card-body">
          <div className="fw-bold">{post.autor}</div>
          {post.fecha && (
            <div className="text-muted small">
              {new Date(post.fecha).toLocaleString()}
            </div>
          )}
          <div className="mt-2">{texto}</div>
          {imagen && <img src={imagen} alt="post" className="img-fluid rounded mt-2" />}
          <button
            className="btn btn-outline-primary mt-3"
            onClick={() => navigate("/")}
          >
            Volver al feed
          </button>
        </div>
      </div>
    </div>
  );
}