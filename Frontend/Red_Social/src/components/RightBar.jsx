export default function RightBar() {
return (
    <div className="fb-sticky">
        <div className="d-flex flex-column gap-3">
            {/* Spotify */}
            <div className="fb-card p-3">
                <div className="fw-bold mb-2">Spotify New releases</div>
                <div className="text-muted small">Próximamente: DUA LIPA EN CASA DE ABRAHAM</div>
            </div>

            {/* Cumpleaños */}
            <div className="fb-card p-3">
                    <div className="fw-bold mb-2">Cumpleaños</div>

                    <div className="d-flex align-items-start gap-2">
                        <i className="bi bi-gift-fill" style={{ fontSize: 18 }}></i>
                        <div className="small">
                            Hoy es el cumpleaños de <strong>ABRAHAM Martinez</strong>.
                        </div>
                    </div>

                <div className="mt-2 small text-muted">
                    Agregar mas?
                </div>
            </div>
        </div>
    </div>
);
}