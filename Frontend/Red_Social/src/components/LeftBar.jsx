export default function LeftBar() {
const items = [
    { label: "Inicio", icon: "bi-house-door-fill" },
    { label: "Amigos", icon: "bi-people-fill" },
    { label: "Grupos", icon: "bi-people" },
    { label: "Marketplace", icon: "bi-shop" },
    { label: "Guardado", icon: "bi-bookmark-fill" },
    { label: "Recuerdos", icon: "bi-clock-history" },
];

return (
    <div className="d-none d-lg-block">
        <div className="fb-sticky">
            <div className="fb-card p-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                    <div
                        className="rounded-circle bg-light border"
                        style={{ width: 36, height: 36 }}
                    />
                    <div className="fw-semibold">Tu perfil</div>
                </div>

        <div className="d-flex flex-column">
            {items.map((it) => (
                <button
                    key={it.label}
                    className="fb-left-btn d-flex align-items-center gap-2 text-start"
                    type="button"
                >
                <i
                    className={`bi ${it.icon}`}
                    style={{ fontSize: 18, width: 22, display: "inline-block" }}
                ></i>
                    <span className="fw-semibold">{it.label}</span>
                </button>
            ))}
                </div>
            </div>
        </div>
    </div>
);
}