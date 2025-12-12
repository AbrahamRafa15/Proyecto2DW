export default function TopBar({ user, userInput, setUserInput, onLogin, onLogout }) {
return (
    <div className="fb-topbar">
        <div className="container py-2">
            <div className="d-flex align-items-center justify-content-between">
                <div className="fb-brand">Red Social</div>

                    <div className="d-flex gap-2 align-items-center">
                        {user ? (
                    <>
                    <span className="me-2">
                        Hola, <strong>{user}</strong>
                    </span>
                    <button className="btn btn-outline-secondary btn-sm" onClick={onLogout}>
                        Cerrar sesión
                    </button>
                    </>
                    ) : (
                <>
                <input
                    className="form-control form-control-sm"
                    style={{ width: 220 }}
                    placeholder="Tu usuario"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                />
                <button className="btn btn-primary btn-sm" onClick={onLogin}>
                    Entrar
                </button>
                </>
                    )}
            </div>
            </div>
        </div>
    </div>
);
}