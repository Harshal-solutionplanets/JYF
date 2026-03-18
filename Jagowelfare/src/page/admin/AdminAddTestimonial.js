import React, { useState } from "react";
import { supabase } from "../../supabase";

const AdminAddTestimonial = ({ onPublish }) => {
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [comment, setComment] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const fileInputRef = React.useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let imageUrl = "";
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const filePath = `testimonials/${fileName}`;
                const { error } = await supabase.storage.from('JYF').upload(filePath, imageFile);
                if (error) throw error;
                const { data } = supabase.storage.from('JYF').getPublicUrl(filePath);
                imageUrl = data.publicUrl;
            }
            const { error } = await supabase.from('testimonials').insert([{ name, role, comment, image_url: imageUrl }]);
            if (error) throw error;
            alert("Testimonial added successfully!");
            if (onPublish) onPublish();
        } catch (error) {
            alert("Submission failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { border: "none", borderBottom: "2px solid #ddd", borderRadius: "0", padding: "12px 0", backgroundColor: "transparent", fontSize: "16px", outline: "none", width: "100%", transition: "all 0.3s", boxSizing: "border-box" };
    const labelStyle = { fontWeight: "700", color: "#222", fontSize: "14px", marginBottom: "10px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" };
    const sectionHeadingStyle = { fontSize: "18px", fontWeight: "800", color: "#e33129", marginBottom: "20px", paddingBottom: "8px", borderBottom: "1px solid #eee", width: "100%" };
    const sectionContainerStyle = { backgroundColor: "#fcfcfc", padding: "25px", borderRadius: "15px", border: "1px solid #f0f0f0", marginBottom: "30px", boxSizing: "border-box" };

    return (
        <div style={{ backgroundColor: "#f4f6f9", padding: "40px 20px", borderRadius: "15px" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "#fff", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
                <h3 style={{ marginBottom: "50px", fontWeight: "800", color: "#222", fontSize: "32px", textAlign: "center" }}>Post Testimonial</h3>
                
                <form onSubmit={handleSubmit}>
                    <div style={sectionContainerStyle}>
                        <div style={sectionHeadingStyle}>Supporter Details</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "30px" }}>
                            <div>
                                <label style={labelStyle}>Full Name</label>
                                <input type="text" style={inputStyle} placeholder="e.g. Alice Smith" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div>
                                <label style={labelStyle}>Designation / Role</label>
                                <input type="text" style={inputStyle} placeholder="e.g. Volunteer / Donor" value={role} onChange={(e) => setRole(e.target.value)} required />
                            </div>
                        </div>

                        <div style={{ marginTop: "30px" }}>
                            <label style={labelStyle}>Profile Photo</label>
                            <input ref={fileInputRef} type="file" style={{ display: "none" }} accept="image/*" onChange={handleImageChange} />
                            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "15px" }}>
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "50%", border: "2px solid #e33129" }} />
                                ) : (
                                    <div onClick={() => fileInputRef.current.click()} style={{ width: "80px", height: "80px", borderRadius: "50%", border: "2px dashed #ddd", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "24px", color: "#aaa" }}>
                                        <i className="fas fa-camera"></i>
                                    </div>
                                )}
                                <button type="button" onClick={() => fileInputRef.current.click()} style={{ backgroundColor: "#333", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "20px", fontSize: "14px" }}>
                                    Change Photo
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style={sectionContainerStyle}>
                        <div style={sectionHeadingStyle}>Their Feedback</div>
                        <div>
                            <label style={labelStyle}>Testimonial Message</label>
                            <textarea style={{ ...inputStyle, minHeight: "120px", border: "1px solid #ddd", padding: "15px", borderRadius: "10px", resize: "none" }} placeholder="Type their testimonial message here..." value={comment} onChange={(e) => setComment(e.target.value)} required />
                        </div>
                    </div>

                    <div className="text-center mt-5">
                        <button type="submit" className="btn btn_theme btn_md" style={{ padding: "18px 100px", borderRadius: "50px", fontWeight: "800", fontSize: "18px", textTransform: "uppercase", letterSpacing: "1.5px", boxShadow: "0 15px 35px rgba(227, 49, 41, 0.25)" }} disabled={loading}>
                            {loading ? "Publishing..." : "Post Testimonial"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAddTestimonial;
