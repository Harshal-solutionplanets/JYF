import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";

const AdminAddTestimonial = ({ onPublish }) => {
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [comment, setComment] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(false);

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
                const imageRef = ref(storage, `testimonials/${Date.now()}_${imageFile.name}`);
                const uploadResult = await uploadBytes(imageRef, imageFile);
                imageUrl = await getDownloadURL(uploadResult.ref);
            }

            await addDoc(collection(db, "testimonials"), {
                name,
                role,
                comment,
                imageUrl,
                createdAt: serverTimestamp()
            });

            alert("Testimonial Published successfully!");
            if (onPublish) onPublish();
        } catch (error) {
            console.error("Error adding testimonial: ", error);
            alert("Submission failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        border: "none",
        borderBottom: "2px solid #ddd",
        borderRadius: "0",
        padding: "12px 0",
        backgroundColor: "transparent",
        fontSize: "16px",
        outline: "none",
        width: "100%",
        transition: "border-bottom-color 0.3s"
    };

    const labelStyle = {
        fontWeight: "600",
        color: "#666",
        fontSize: "14px",
        marginBottom: "5px",
        display: "block"
    };

    return (
        <div style={{ backgroundColor: "#fff", padding: "40px", borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <h3 style={{ marginBottom: "40px", fontWeight: "800", color: "#222", fontSize: "26px", textAlign: "center" }}>Testimonial Submission</h3>
            
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-lg-6 mb-5">
                        <label style={labelStyle}>Supporter Name</label>
                        <input 
                            type="text" 
                            style={inputStyle}
                            placeholder="e.g. Alice Smith" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            onFocus={(e) => e.target.style.borderBottomColor = "#e33129"}
                            onBlur={(e) => e.target.style.borderBottomColor = "#ddd"}
                            required 
                        />
                    </div>

                    <div className="col-lg-6 mb-5">
                        <label style={labelStyle}>Supporter Role / Title</label>
                        <input 
                            type="text" 
                            style={inputStyle}
                            placeholder="e.g. Volunteer / Donor" 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)} 
                            onFocus={(e) => e.target.style.borderBottomColor = "#e33129"}
                            onBlur={(e) => e.target.style.borderBottomColor = "#ddd"}
                            required 
                        />
                    </div>

                    <div className="col-lg-12 mb-5">
                        <label style={labelStyle}>Profile Photo</label>
                        <input 
                            type="file" 
                            style={{ ...inputStyle, borderBottom: "none" }}
                            accept="image/*"
                            onChange={handleImageChange}
                            required 
                        />
                        <div style={{ width: "100%", height: "2px", backgroundColor: "#ddd" }}></div>
                        {previewUrl && (
                            <div style={{ marginTop: "20px" }}>
                                <img src={previewUrl} alt="Preview" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "50%", border: "2px solid #ddd" }} />
                            </div>
                        )}
                    </div>

                    <div className="col-lg-12 mb-5">
                        <label style={labelStyle}>Their Message (Testimonial)</label>
                        <textarea 
                            style={{ ...inputStyle, minHeight: "100px" }}
                            placeholder="Share their experience with the organization..." 
                            value={comment} 
                            onChange={(e) => setComment(e.target.value)} 
                            onFocus={(e) => e.target.style.borderBottomColor = "#e33129"}
                            onBlur={(e) => e.target.style.borderBottomColor = "#ddd"}
                            required
                        ></textarea>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <button 
                        type="submit" 
                        className="btn btn_theme btn_md" 
                        style={{ padding: "12px 60px", borderRadius: "30px", fontWeight: "700", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px" }} 
                        disabled={loading}
                    >
                        {loading ? "Publishing..." : "Post Testimonial"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminAddTestimonial;
