import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import CommonBanner from "../../component/Common/CommonBanner";
import { useAuth } from "../../auth/AuthProvider";
import logo from "../../assets/img/logo.jpeg";

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const { user, isAdmin, isStaff } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // If already logged in as admin/staff, redirect to dashboard
    useEffect(() => {
        if (user && (isAdmin || isStaff)) {
            navigate("/admin/dashboard");
        }
    }, [user, isAdmin, isStaff, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // Check roles from metadata
            const loggedInUser = data.user;
            const userRole = loggedInUser?.app_metadata?.role || loggedInUser?.user_metadata?.role;
            
            if (userRole === "admin" || userRole === "staff") {
                navigate("/admin/dashboard");
            } else {
                // If not an admin, sign them out and show error (Admin-only page)
                await supabase.auth.signOut();
                setError("Access Denied: You do not have administrator privileges.");
            }
        } catch (err) {
            setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    const containerStyle = {
        maxWidth: "480px",
        margin: "0 auto",
        padding: "60px 40px",
        backgroundColor: "rgba(235, 247, 255, 0.7)", // Light blue tint
        borderRadius: "20px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
        textAlign: "center",
        border: "1px solid #e1eef7"
    };

    const cardInsideStyle = {
        backgroundColor: "#fff",
        padding: "40px 30px",
        borderRadius: "15px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.03)"
    }

    const inputWrapperStyle = {
        position: "relative",
        marginBottom: "20px"
    };

    const iconStyle = {
        position: "absolute",
        left: "20px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#5c6299",
        fontSize: "16px"
    };

    const inputFieldStyle = {
        height: "58px",
        borderRadius: "12px",
        border: "1px solid #eef2f6",
        paddingLeft: "55px",
        fontSize: "15px",
        backgroundColor: "#fff",
        width: "100%",
        transition: "all 0.3s ease"
    };

    return (
        <>
            <CommonBanner heading="Admin Login" pagination="Admin Login" />
            <section className="section_padding" style={{ backgroundColor: "#fbfcfd" }}>
                <div className="container">
                    <div style={containerStyle}>
                        <div style={cardInsideStyle}>
                            <img 
                                src={logo} 
                                alt="logo" 
                                style={{ width: "180px", marginBottom: "20px" }} 
                            />
                            <h3 style={{ fontWeight: "800", color: "#1a2b53", marginBottom: "30px", fontSize: "28px", letterSpacing: "-0.5px" }}>Admin Login</h3>
                            
                            <form onSubmit={handleLogin}>
                                <div style={inputWrapperStyle}>
                                    <i className="far fa-envelope" style={iconStyle}></i>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={inputFieldStyle}
                                        required
                                    />
                                </div>
                                <div style={inputWrapperStyle}>
                                    <i className="fas fa-key" style={iconStyle}></i>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={inputFieldStyle}
                                        required
                                    />
                                </div>
                                
                                {error && (
                                    <div style={{ color: "#ca1e14", marginBottom: "25px", fontWeight: "600", fontSize: "14px", padding: "12px", backgroundColor: "#fff5f5", borderRadius: "10px" }}>
                                        <i className="fas fa-exclamation-circle mr-2"></i> {error}
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    className="btn btn_theme btn_md w-100" 
                                    style={{ 
                                        height: "58px", 
                                        borderRadius: "12px", 
                                        fontWeight: "800", 
                                        fontSize: "17px",
                                        backgroundColor: "#3a417a", // Darker blue like the ref
                                        border: "none",
                                        boxShadow: "0 8px 20px rgba(58, 65, 122, 0.25)"
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <><i className="fas fa-spinner fa-spin mr-2"></i> Authenticating...</>
                                    ) : (
                                        <><i className="fas fa-sign-in-alt mr-2"></i> Login</>
                                    )}
                                </button>
                            </form>
                        </div>
                        
                        <div style={{ marginTop: "40px" }}>
                            <p style={{ fontSize: "14px", color: "#8a96a3", fontWeight: "500" }}>
                                <i className="fas fa-shield-alt mr-2"></i> Authorized Personnel Only
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AdminLoginPage;
