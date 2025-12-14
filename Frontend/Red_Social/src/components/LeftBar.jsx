import homeIcon from "../assets/HomeMyDog.svg";
import friendsIcon from "../assets/FriendsMyDog.svg";
import groupsIcon from "../assets/GroupsDogLogo.svg";
import savedIcon from "../assets/GuardadoMyDog.svg";
import memoriesIcon from "../assets/RecuerdosMyDog.svg";

export default function LeftBar() {
    const items = [
        { label: "Inicio", icon: homeIcon },
        { label: "Amigos", icon: friendsIcon },
        { label: "Grupos", icon: groupsIcon },
        { label: "Guardado", icon: savedIcon },
        { label: "Recuerdos", icon: memoriesIcon },
    ];

    return (
        <div className="d-none d-lg-block">
            <div className="fb-sticky">
                <div className="fb-card p-3">
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <div className="fb-avatar" />
                        <div className="fw-semibold">Tu perfil</div>
                    </div>

                    <div className="d-flex flex-column gap-2">
                        {items.map((it) => (
                            <button
                                key={it.label}
                                className="btn btn-light text-start d-flex align-items-center gap-2 fb-leftitem"
                                type="button"
                            >
                                <img
                                    src={it.icon}
                                    alt={it.label}
                                    className="fb-navicon-img"
                                />
                                <span className="fw-semibold">{it.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}