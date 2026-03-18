import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";

const RegisterArea = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName,
            phone: phone,
          },
        },
      });

      if (err) throw err;

      alert("Registration successful! Please check your email for confirmation.");
      navigate("/login");
    } catch (err) {
      setError(err?.message || "Registration failed");
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
                        <h3>Register your account</h3>
                        <h2>Become a
                            <span className="color_big_heading">member</span>
                            and enhance your hand
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
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter full name"
                                  value={displayName}
                                  onChange={(e) => setDisplayName(e.target.value)}
                                  required
                                />
                            </div>
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
                                  type="tel"
                                  className="form-control"
                                  placeholder="Enter mobile number (optional)"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
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
                                  {submitting ? "Registering..." : "Register"}
                                </button>
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

export default RegisterArea