import { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

/**
 * Componente de cabecera que muestra un mensaje de bienvenida personalizado.
 */
const Header = () => {
    const { userData } = useContext(AppContext);

    return (
        <div className="text-center px-3" style={{ maxWidth: "600px" }}>

            {/* Logo con sombra sutil */}
            <img
                src={assets.header}
                alt="header"
                width={120}
                className="mb-4"
                style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}
            />
            <h5 className="fw-semibold text-primary">
                Hi {userData?.name || 'Developer'} <span role="img" aria-label="wave">👋</span>
            </h5>
            <h1 className="fw-bold display-5 mb-3" style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
            }}>
                Welcome to Authify
            </h1>

            <p className="text-muted fs-5 mb-4">
                Setup authentication in minutes with our easy-to-use solution
            </p>

            {/* Botón Get Started */}
            <button
                className="btn btn-primary rounded-pill px-4 py-2 fw-medium"
                style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                    transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
                onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
            >
                Get Started
            </button>
        </div>
    )
}

export default Header;