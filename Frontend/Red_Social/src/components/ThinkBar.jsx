export default function ThinkBar({
    text,
    setText,
    imageUrl,
    setImageUrl,
    canPost,
    isEditing,
    onCancelEdit,
    onSubmit,   
}) {
    return (
    <div className="fb-card fb-compose mb-3">
        <div className="card-body">
            <textarea
                className="form-control fb-compose-textarea border-0"
                rows={4}
                placeholder="¿Qué piensas?"
                value={text}
                onChange={(e) => setText(e.target.value)}
            /> 

        <div className="fb-compose-footer mt-3">
            <input
                className="form-control fb-compose-url"
                placeholder="URL de imagen (opcional)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
            />
            <div className="fb-compose-actions">
                <button
                    className="btn fb-btn"
                    onClick={onSubmit}
                    disabled={!canPost}
                >
                    {isEditing ? "Actualizar" : "Publicar"}
                </button>

                {isEditing && (
                <button
                    className="btn fb-btn-ghost"
                    onClick={onCancelEdit}
                >
                Cancelar
                </button>
                )}
            </div>
        </div>

        {!canPost && (
            <div className="fb-compose-hint mt-2">
                Debes iniciar sesión (usuario) para publicar. El header se enviará como{" "}
                <code>x-user</code>.
            </div>
        )}
        </div>
    </div>
    );
}
