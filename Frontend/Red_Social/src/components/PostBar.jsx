import { useNavigate } from "react-router-dom";

export default function PostBar({ posts, user, onUpdatePost, onDeletePost, onStartEditPost }) {
  const navigate = useNavigate();
  if (!posts || posts.length === 0) {
    return <div className="alert alert-secondary">No hay posts todavía.</div>;
  }

  return (
    <div className="d-flex flex-column gap-3 fb-post-list">
      {posts.map((p) => {
        // El backend manda todo el texto en `contenido`
        // Usamos la primera línea como texto y la segunda (si existe) como imagen
        const lineas = (p.contenido || "").split("\n");
        const texto = lineas[0] || "";
        const imagen = lineas.length > 1 ? lineas[1] : null;

        return (
          <article className="fb-card fb-post" key={p.id}>
            <div className="card-body">
              <div className="fb-post-header">
                <div>
                  <div className="fb-post-author">{p.autor}</div>
                  {p.fecha && (
                    <div className="fb-post-date">
                      {new Date(p.fecha).toLocaleString()}
                    </div>
                  )}
                </div>

                {user && p.autor === user && (
                  <div className="fb-post-owner-actions">
                    <button
                      className="btn btn-sm fb-btn-ghost"
                      onClick={() => onStartEditPost(p)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm fb-btn-danger"
                      onClick={() => onDeletePost(p.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>

              <div className="fb-post-content">
                <p className="fb-post-text">{texto}</p>
                {imagen && (
                  <div className="fb-post-media">
                    <img src={imagen} alt="post" loading="lazy" />
                  </div>
                )}
              </div>

              <div className="fb-post-footer">
                <div className="fb-post-cta">
                  <button
                    className="btn fb-btn-ghost"
                    onClick={() => {
                      navigate(`/posts/${p.id}`);
                    }}
                  >
                    Ver
                  </button>

                  <button
                    className="btn fb-btn"
                    onClick={() => {
                      const postUrl = `${import.meta.env.VITE_API_URL}/og/posts/${p.id}`;
                      navigator.clipboard.writeText(postUrl);
                      alert("Link copiado para compartir ✨");
                    }}
                  >
                    Compartir
                  </button>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
