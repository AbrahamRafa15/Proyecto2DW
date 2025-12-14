export default function PostBar({ posts }) {
  if (!posts || posts.length === 0) {
    return <div className="alert alert-secondary">No hay posts todavía.</div>;
  }

  return (
    <div className="d-flex flex-column gap-3">
      {posts.map((p) => {
        // El backend manda todo el texto en `contenido`
        // Usamos la primera línea como texto y la segunda (si existe) como imagen
        const lineas = (p.contenido || "").split("\n");
        const texto = lineas[0] || "";
        const imagen = lineas.length > 1 ? lineas[1] : null;

        return (
          <div className="card" key={p.id}>
            <div className="card-body">
              <div className="fw-bold">{p.autor}</div>

              {p.fecha && (
                <div className="text-muted small">
                  {new Date(p.fecha).toLocaleString()}
                </div>
              )}

              <div className="mt-2">{texto}</div>

              {imagen && (
                <img
                  src={imagen}
                  alt="post"
                  className="img-fluid rounded mt-2"
                />
              )}

              <div className="mt-3">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    const ogUrl = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/og/posts/${p.id}`;
                    navigator.clipboard.writeText(ogUrl);
                    alert("Link copiado para compartir ✨");
                  }}
                >
                  Compartir
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}