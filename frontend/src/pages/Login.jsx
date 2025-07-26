import { Link, useNavigate } from 'react-router-dom';
import { assets } from "../assets/assets";
import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {

    const [isCreateAccount, setIsCreateAccount] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { backendURL, setIsLoggedIn, getUserData } = useContext(AppContext);
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        setLoading(true);
        try {
            if (isCreateAccount) {
                //register API
                const response = await axios.post(`${backendURL}/register`, { name, email, password })
                if (response.status === 201) {
                    navigate("/");
                    toast.success("Account created successfully.");
                } else {
                    toast.error("Email already exists.");
                }
            } else {
                //Login API
                const response = await axios.post(`${backendURL}/login`, { email, password })
                if (response.status === 200) {
                    setIsLoggedIn(true);
                    getUserData();
                    navigate("/");
                } else {
                    toast.error("Email or Password incorrect.");
                }
            }
        } catch (error) {
            toast.error(error.response.data.message);
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
                <h2 className="text-center mb-4" style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                }}>
                    {isCreateAccount ? "Create Account" : "Welcome Back"}
                </h2>

                <form onSubmit={onSubmitHandler}>
                    {isCreateAccount && (
                        <div className="mb-3">
                            <label htmlFor="fullName" className="form-label" style={{
                                color: "#4a5568",
                                fontWeight: "500"
                            }}>Full Name</label>
                            <input 
                                type="text"
                                id="fullName"
                                className="form-control py-2"
                                style={{
                                    borderRadius: "8px",
                                    border: "1px solid #e2e8f0",
                                    transition: "all 0.3s ease"
                                }}
                                placeholder="John Smith"
                                required
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            />
                        </div>
                    )}

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label" style={{
                            color: "#4a5568",
                            fontWeight: "500"
                        }}>Email</label>
                        <input 
                            type="email"
                            id="email"
                            className="form-control py-2"
                            style={{
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                                transition: "all 0.3s ease"
                            }}
                            placeholder="example@gmail.com"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label" style={{
                            color: "#4a5568",
                            fontWeight: "500"
                        }}>Password</label>
                        <input 
                            type="password"
                            id="password"
                            className="form-control py-2"
                            style={{
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                                transition: "all 0.3s ease"
                            }}
                            placeholder="********"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </div>

                    {!isCreateAccount && (
                        <div className="d-flex justify-content-between mb-3">
                            <Link to="/reset-password" className="text-decoration-none" style={{ color: "#667eea" }}>
                                Forgot password?
                            </Link>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="btn w-100 py-2"
                        style={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "1rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: "0 4px 6px rgba(102, 126, 234, 0.3)"
                        }}
                        onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                        onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        ) : null}
                        {loading ? "Processing..." : isCreateAccount ? "Create Account" : "Login"}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="mb-0" style={{ color: "#4a5568" }}>
                        {isCreateAccount ? (
                            <>
                                Already have an account?{" "}
                                <span
                                    onClick={() => setIsCreateAccount(false)}
                                    style={{ 
                                        color: "#667eea",
                                        cursor: "pointer",
                                        fontWeight: "500",
                                        textDecoration: "underline"
                                    }}
                                >
                                    Login here
                                </span>
                            </>
                        ) : (
                            <>
                                Don't have an account?{" "}
                                <span
                                    onClick={() => setIsCreateAccount(true)}
                                    style={{ 
                                        color: "#667eea",
                                        cursor: "pointer",
                                        fontWeight: "500",
                                        textDecoration: "underline"
                                    }}
                                >
                                    Sign Up
                                </span>
                            </>
                        )}
                    </p>
                </div>
            </div>
                   
        </div>
    )
}

export default Login;