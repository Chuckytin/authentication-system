import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useRef, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

/**
 * Componente para verificación de email mediante OTP.
 */
const EmailVerify = () => {
    const inputRef = useRef([]);
    const [loading, setLoading] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const { getUserData, userData, backendURL } = useContext(AppContext);
    const navigate = useNavigate();

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/, "");
        e.target.value = value;
        if (value && index < 5) {
            inputRef.current[index + 1].focus();
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            inputRef.current[index - 1].focus();
        }
    }

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").slice(0, 6).split("");
        paste.forEach((digit, i) => {
            if (inputRef.current[i]) {
                inputRef.current[i].value = digit;
            }
        });
        const next = paste.length < 6 ? paste.length : 5;
        inputRef.current[next].focus();
    }

    const handleVerify = async () => {
        const otp = inputRef.current.map(input => input.value).join("");
        if (otp.length !== 6) {
            toast.error("Please enter all 6 digits of the OTP.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${backendURL}/verify-otp`, { otp });
            if (response.status === 200) {
                toast.success("OTP verified successfully!");
                getUserData();
                navigate("/");
            } else {
                toast.error("Invalid OTP");
            }
        } catch (error) {
            toast.error("Failed to verify OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="position-relative min-vh-100 d-flex flex-column justify-content-center align-items-center"
            style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                overflow: "hidden"
            }}>

            {/* Efectos de burbujas */}
            <div style={{
                position: "absolute",
                top: "-10%",
                right: "-10%",
                width: "500px",
                height: "500px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)",
                opacity: "0.9",
                animation: "moveBubble 15s infinite ease-in-out"
            }}></div>

            <div style={{
                position: "absolute",
                bottom: "-15%",
                left: "-15%",
                width: "600px",
                height: "600px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
                opacity: "0.8",
                animation: "moveBubble 12s infinite ease-in-out"
            }}></div>

            {/* Logo + Texto */}
            <Link
                to="/"
                className="d-flex align-items-center gap-2"
                style={{
                    position: "absolute",
                    top: "30px",
                    left: "40px",
                    zIndex: 2,
                    cursor: "pointer",
                    transition: "all 0.3s ease-in-out",
                    textDecoration: "none"
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.querySelector("img").style.transform = "rotate(10deg)";
                    e.currentTarget.querySelector("img").style.filter = "brightness(1.2) drop-shadow(0 0 6px rgba(102, 126, 234, 0.6))";
                    e.currentTarget.querySelector("span").style.textShadow = "0 0 12px rgba(102, 126, 234, 0.5)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.querySelector("img").style.transform = "rotate(0)";
                    e.currentTarget.querySelector("img").style.filter = "brightness(1)";
                    e.currentTarget.querySelector("span").style.textShadow = "none";
                }}
            >
                <img
                    src={assets.logo}
                    alt="logo"
                    style={{
                        height: "45px",
                        width: "45px",
                        transition: "all 0.3s ease-in-out"
                    }}
                />
                <span
                    className="fw-bold fs-3"
                    style={{
                        fontWeight: "700",
                        background: "linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        transition: "all 0.3s ease-in-out",
                        display: "inline-block"
                    }}
                >
                    Authify
                </span>
            </Link>

            {/* Contenedor del formulario */}
            <div className="position-relative z-1" style={{
                width: "100%",
                maxWidth: "450px",
                padding: "2.5rem",
                backgroundColor: "rgba(255, 255, 255, 0.97)",
                borderRadius: "16px",
                boxShadow: "0 12px 30px rgba(0, 0, 0, 0.15)",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(255, 255, 255, 0.2)"
            }}>
                <div className="text-center mb-4">
                    <img
                        src={assets.logo_home}
                        alt="email-verify"
                        width={80}
                        className="mb-3"
                        style={{ filter: "drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3))" }}
                    />
                    <h2 className="fw-bold mb-2" style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        Verify Your Email
                    </h2>
                    <p className="text-muted">
                        We've sent a 6-digit code to <span className="fw-semibold">{userData?.email}</span>
                    </p>
                </div>

                {/* Inputs OTP */}
                <div className="d-flex justify-content-between gap-3 mb-4">
                    {[...Array(6)].map((_, i) => (
                        <input
                            key={i}
                            type="text"
                            maxLength={1}
                            className="form-control text-center py-3 fs-4"
                            style={{
                                borderRadius: "12px",
                                border: "1px solid #e2e8f0",
                                transition: "all 0.3s ease",
                                boxShadow: "0 2px 6px rgba(102, 126, 234, 0.1)",
                                fontWeight: "600",
                                color: "#667eea",
                                height: "60px"
                            }}
                            ref={(el) => (inputRef.current[i] = el)}
                            onChange={(e) => handleChange(e, i)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            onPaste={handlePaste}
                            onFocus={(e) => {
                                e.target.style.borderColor = "#667eea";
                                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.2)";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#e2e8f0";
                                e.target.style.boxShadow = "0 2px 6px rgba(102, 126, 234, 0.1)";
                            }}
                        />
                    ))}
                </div>

                <button
                    className="btn w-100 py-3 mb-3"
                    style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "1rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)"
                    }}
                    onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                    onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                    disabled={loading}
                    onClick={handleVerify}
                >
                    {loading ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : null}
                    {loading ? "Verifying..." : "Verify Email"}
                </button>
            </div>
        </div>
    )
}

export default EmailVerify;