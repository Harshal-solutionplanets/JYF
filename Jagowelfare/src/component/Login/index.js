import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";

const LoginArea = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // For now, let's assume any logged-in user can access admin for the demo
      // In a real app, you'd check a 'profiles' table or use custom claims
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
     <section id="login_arae" className="section_padding">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
                    <div className="section_heading">
                        <h3>Login your account</h3>
                        <h2>Join our
                            <span className="color_big_heading">community</span>
                            to help peoples
                        </h2>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6 offset-lg-3">
                    <div className="author_form_area">
                        <form id="author_form" onSubmit={onSubmit}>
                            <div className="form-group">
                                <input
                                  type="email"
                                  className="form-control"
                                  placeholder="Enter email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                  type="password"
                                  className="form-control"
                                  placeholder="Enter password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  required
                                />
                            </div>
                            <div className="author_submit_form">
                                {error ? (
                                  <p className="mt-2" style={{ color: "#b00020" }}>
                                    {error}
                                  </p>
                                ) : null}
                                <button className="btn btn_theme btn_md" type="submit" disabled={submitting}>
                                  {submitting ? "Logging in..." : "Login"}
                                </button>
                                <p>Dont have an account? <Link to="/register">Register now</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
  )
}

export default LoginArea