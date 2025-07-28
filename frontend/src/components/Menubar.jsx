import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from 'axios';

/**
 * Componente de barra de navegación superior que muestra el logo y maneja el estado de autenticación.
 */
const Menubar = () => {
    const navigate = useNavigate();
    const { userData, backendURL, setIsLoggedIn, setUserData } = useContext(AppContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    /**
     * Efecto para manejar clics fuera del dropdown del usuario.
     */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /**
     * Maneja el logout del usuario.
     */
    const handleLogout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.post(`${backendURL}/logout`);
            if (response.status === 200) {
                setIsLoggedIn(false);
                setUserData(false);
                navigate("/");
            }
        } catch (error) {
            toast.error("Logout failed!");
        }
    }

    /**
     * Envía un OTP al correo electrónico del usuario para la verificación
     */
    const sendVerificationOtp = async () => {
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.post(`${backendURL}/send-otp`);
            if (response.status === 200) {
                navigate("/email-verify");
                toast.success("OTP has been sent successfully.");
            } else {
                toast.error("Unable to send OTP!");
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <nav className="navbar bg-white px-4 py-3 d-flex justify-content-between align-items-center shadow-sm">

            {/* Contenedor que agrupa logo + texto */}
            <div
                className="d-flex align-items-center gap-2"
                onClick={() => navigate("/")}
                style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease-in-out"
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)"; // Escalado suave del grupo
                    e.currentTarget.querySelector("img").style.transform = "rotate(10deg)";
                    e.currentTarget.querySelector("img").style.filter = "brightness(1.1) drop-shadow(0 0 6px rgba(102, 126, 234, 0.4))";
                    e.currentTarget.querySelector("span").style.textShadow = "0 0 8px rgba(102, 126, 234, 0.3)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.querySelector("img").style.transform = "rotate(0)";
                    e.currentTarget.querySelector("img").style.filter = "brightness(1)";
                    e.currentTarget.querySelector("span").style.textShadow = "none";
                }}
            >
                {/* Logo */}
                <img
                    src={assets.logo_home}
                    alt="logo_home"
                    width={45}
                    height={45}
                    style={{
                        transition: "all 0.3s ease-in-out"
                    }}
                />

                {/* Texto "Authify" */}
                <span
                    className="fw-bold fs-3"
                    style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        transition: "all 0.3s ease-in-out",
                        display: "inline-block"
                    }}
                >
                    Authify
                </span>
            </div>
            {/* Contenedor para el menú de usuario o botón de login */}
            {userData ? (
                <div className="position-relative" ref={dropdownRef}>
                    <div className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center"
                        style={{
                            width: "40px",
                            height: "40px",
                            cursor: "pointer",
                            userSelect: "none"
                        }}
                        onClick={() => setDropdownOpen((prev) => !prev)}
                    >
                        {userData.name[0].toUpperCase()}
                    </div>
                    {dropdownOpen && (
                        <div className="position-absolute shadow bg-white rounded p-2"
                            style={{
                                top: "50px",
                                right: 0,
                                zIndex: 100
                            }}
                        >
                            {!userData.isAccountVerified && (
                                <div className="dropdown-item py-1 px-2"
                                    style={{ cursor: "pointer" }}
                                    onClick={sendVerificationOtp}
                                >
                                    Verify email
                                </div>
                            )}
                            <div className="dropdown-item py-1 px-2 text-danger"
                                style={{ cursor: "pointer" }}
                                onClick={handleLogout}
                            >
                                Logout
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                < button
                    className="btn rounded-pill px-3 py-2 d-flex align-items-center"
                    onClick={() => navigate("/login")}
                    style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        border: "none",
                        boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
                        transition: "all 0.3s ease"
                    }}
                    onMouseOver={(e) => e.target.style.transform = "translateX(4px)"}
                    onMouseOut={(e) => e.target.style.transform = "translateX(0)"}
                >
                    Login <i className="bi bi-arrow-right ms-2"></i>
                </button>
            )}
        </nav >
    )
}

export default Menubar;