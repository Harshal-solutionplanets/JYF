import React, { useState } from "react";
import { supabase } from "../../supabase";

const AdminAddTeam = ({ onPublish }) => {
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
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
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const filePath = `team/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('JYF')
                    .upload(filePath, imageFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('JYF')
                    .getPublicUrl(filePath);
                
                imageUrl = publicUrl;
            }

            const { error: insertError } = await supabase
                .from('team')
                .insert([{ name, role, imageUrl }]);

            if (insertError) throw insertError;

            alert("Team member added successfully to Supabase!");
            if (onPublish) onPublish();
        } catch (error) {
            console.error("Error adding member: ", error);
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
            <h3 style={{ marginBottom: "40px", fontWeight: "800", color: "#222", fontSize: "26px", textAlign: "center" }}>Team Enrollment (Supabase)</h3>
            
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-lg-12 mb-5">
                        <label style={labelStyle}>Full Name</label>
                        <input 
                            type="text" 
                            style={inputStyle}
                            placeholder="e.g. John Doe" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            onFocus={(e) => e.target.style.borderBottomColor = "#e33129"}
                            onBlur={(e) => e.target.style.borderBottomColor = "#ddd"}
                            required 
                        />
                    </div>

                    <div className="col-lg-12 mb-5">
                        <label style={labelStyle}>Designation / Role</label>
                        <input 
                            type="text" 
                            style={inputStyle}
                            placeholder="e.g. Chief Coordinator" 
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
                                <img src={previewUrl} alt="Preview" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "50%", border: "2px solid #ddd" }} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center mt-4">
                    <button 
                        type="submit" 
                        className="btn btn_theme btn_md" 
                        style={{ padding: "12px 60px", borderRadius: "30px", fontWeight: "700", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px" }} 
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Confirm Member"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminAddTeam;
