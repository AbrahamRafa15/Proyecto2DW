export default function ThinkBar({
    text,
    setText,
    imageUrl,
    setImageUrl,
    canPost,
    onPublish,
    isEditing,
    onCancelEdit,
    onSubmit,   
}) {
    return (
    <div className="fb-card p-3 mb-3">
        <div className="card-body">
            <textarea
                className="form-control border-0 "
                rows={4}
                placeholder="¿Qué piensas?"
                value={text}
                onChange={(e) => setText(e.target.value)}
            /> 

        <div className="d-flex gap-2">
            <input
                className="form-control"
                placeholder="URL de imagen (opcional)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
            />
            <button className="btn btn-primary" onClick={onSubmit} disabled={!canPost}>
                {isEditing ? "Actualizar" : "Publicar"}
            </button>

            {isEditing && (
            <button className="btn btn-outline-secondary" onClick={onCancelEdit}>
            Cancelar
            </button>
            )}
            
        </div>

        {!canPost && (
            <div className="mt-2 text-muted" style={{ fontSize: 14 }}>
                Debes iniciar sesión (usuario) para publicar. El header se enviará como{" "}
                <code>x-user</code>.
            </div>
        )}
        </div>
    </div>
    );
}