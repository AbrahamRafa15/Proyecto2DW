export default function TopBar({ user, userInput, setUserInput, onLogin, onLogout }) {
    return (
        <div className="d-flex align-items-center justify-content-between py-3">
            <h2 className="m-0">Red Social</h2>

        <div className="d-flex gap-2 align-items-center">
            {user ? (
            <>
                <span className="me-2">
                    Hola, <strong>{user}</strong>
                </span>
                <button className="btn btn-outline-secondary" onClick={onLogout}>
                    Cerrar sesión
                </button>
            </>
            ) : (
            <>
                <input
                    className="form-control"
                    style={{ width: 220 }}
                    placeholder="Tu usuario"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                />
                <button className="btn btn-primary" onClick={onLogin}>
                    Entrar
                </button>
            </>
        )}
            </div>
        </div>
    );
}