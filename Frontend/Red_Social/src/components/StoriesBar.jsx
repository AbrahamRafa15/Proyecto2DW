export default function StoriesBar() {
  // Placeholder: Real o Fake stories data
    const stories = [
    { name: "Crear historia", isCreate: true },
    { name: "Historia1" },
    { name: "Historia2" },
    { name: "Historia3" },
    { name: "Historia4" },
    ];

    return (
        <div className="fb-card p-3 mb-3">
        
        <div className="d-flex gap-3 overflow-auto">
            {stories.map((s, idx) => (
                <div
                key={idx}
                className="text-center flex-shrink-0"
                style={{ width: 110 }}
                >
                <div
                    className="border rounded-3 d-flex align-items-end justify-content-center"
                    style={{
                    height: 150,
                    background: "#f1f2f4",
                    position: "relative",
                    overflow: "hidden",
                    }}
                >
                {s.isCreate ? (
                    <div
                        className="bg-white border rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                            width: 36,
                            height: 36,
                            position: "absolute",
                        bottom: 10,
                        }}
                        >
                        <span className="fw-bold">+</span>
                    </div>
                ) : null}
                </div>

                <div className="mt-2 small fw-semibold">{s.name}</div>
            </div>
            ))}
            </div>
    </div>
    );
}