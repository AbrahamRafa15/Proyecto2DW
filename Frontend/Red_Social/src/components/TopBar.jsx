import myDogLogo from "../assets/MyDogLogo.svg";

export default function TopBar({
    user,
    userInput,
    setUserInput,
    onLogin,
    onLogout,
    theme,
    onToggleTheme,
}) {
return (
    <div className="fb-topbar">
    <div className="container py-2">
        <div className="fb-topbar-content d-flex align-items-center justify-content-between gap-3">
        {/* Brand con logo */}
        <div className="fb-top-brand d-flex align-items-center gap-2">
            <img
                src={myDogLogo}
                alt="MyDog"
                className="fb-top-logo"
            />
            <div className="fb-brand">MY DOG</div>
            </div>

            <div className="fb-top-actions d-flex gap-2 align-items-center flex-wrap">
            {/* Botón Theme */}
            <button
                className="btn btn-light btn-sm fb-top-themebtn"
                type="button"
                onClick={onToggleTheme}
                title={theme === "dark" ? "Modo Claro" : "Modo Oscuro"}
            >
            <i
                className={`bi ${
                theme === "dark" ? "bi-sun-fill" : "bi-moon-stars-fill"
                }`}
            ></i>
            </button>

            {user ? (
            <>
                <span className="me-2">
                    Hola, <strong>{user}</strong>
                </span>
                <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={onLogout}
                >
                    Cerrar sesión
                </button>
            </>
            ) : (
                <>
                <input
                    className="form-control form-control-sm fb-top-userinput"
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
