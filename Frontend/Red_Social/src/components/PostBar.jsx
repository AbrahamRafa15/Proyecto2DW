export default function PostBar({ posts }) {
    if (!posts || posts.length === 0) {
    return <div className="alert alert-secondary">No hay posts todavía.</div>;
    }

    return (
    <div className="d-flex flex-column gap-3">
        {posts.map((p) => (
        <div className="card" key={p.id ?? `${p.user}-${p.created_at}-${p.text}`}>
            <div className="card-body">
            <div className="fw-bold">{p.user}</div>
            <div className="mt-2">{p.text}</div>
                {p.image_url && (
                    <img
                    src={p.image_url}
                    alt="post"
                    className="img-fluid rounded mt-2"
                    />
                )}
            </div>
        </div>
        ))}
    </div>
    );
}