import React, { useEffect, useState } from "react";

export default function RightBar({ apiUrl }) {
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        let alive = true;

        async function load() {
        setLoading(true);
        setErrMsg("");

        try {
            const res = await fetch(`${apiUrl}/spotify/new-releases?limit=8`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
            if (!alive) return;
            setReleases(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("spotify new-releases:", err);
            if (!alive) return;
                setErrMsg("No se pudo cargar Spotify.");
                setReleases([]);
            } finally {
            if (!alive) return;
                setLoading(false);
            }
    }

        // Si no hay apiUrl, no fetch
        if (!apiUrl) {
        setLoading(false);
        setErrMsg("Falta apiUrl en RightBar.");
        return;
        }

        load();
        return () => {
        alive = false;
        };
    }, [apiUrl]);

return (
    <div className="fb-sticky">
    <div className="d-flex flex-column gap-3">
        {/* Spotify */}
            <div className="fb-card p-3">
            <div className="fw-bold mb-2">Spotify · New releases</div>

            {loading && <div className="fb-muted small">Cargando…</div>}

            {!loading && errMsg && (
                <div className="fb-muted small">{errMsg}</div>
            )}

            {!loading && !errMsg && releases.length === 0 && (
            <div className="fb-muted small">Sin resultados.</div>
            )}

            {!loading && !errMsg && releases.length > 0 && (
            <div className="d-flex flex-column gap-2">
                {releases.map((r, i) => (
                <div key={i}>
                    <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="fw-semibold text-decoration-none"
                        style={{ color: "var(--fb-text)" }}
                    >
                        {r.name}
                    </a>
                    <div className="fb-muted small">
                    {Array.isArray(r.artists) ? r.artists.join(", ") : ""}
                    {r.release_date ? ` — ${r.release_date}` : ""}
                    </div>
                </div>
            ))}
            </div>
        )}
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

            <div className="mt-2 fb-muted small">Agregar mas?</div>
        </div>
        </div>
    </div>
);
}