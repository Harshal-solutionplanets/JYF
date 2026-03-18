import React, { useState } from "react";
import { supabase } from "../../supabase";

const AdminAddGallery = ({ onPublish }) => {
    const [title, setTitle] = useState("");
    const [imageFiles, setImageFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setImageFiles(filesArray);
            
            const urls = filesArray.map(file => URL.createObjectURL(file));
            setPreviewUrls(urls);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let uploadedUrls = [];
            
            if (imageFiles.length > 0) {
                for (let i = 0; i < imageFiles.length; i++) {
                    const file = imageFiles[i];
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}_${i}.${fileExt}`;
                    const filePath = `gallery/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('jyf-assets')
                        .upload(filePath, file);

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                        .from('jyf-assets')
                        .getPublicUrl(filePath);
                    
                    uploadedUrls.push(publicUrl);
                }
            }

            const insertData = uploadedUrls.map(url => ({
                title: title, 
                image_url: url
            }));

            if (insertData.length > 0) {
                const { error: insertError } = await supabase
                    .from('gallery')
                    .insert(insertData);

                if (insertError) throw insertError;
            }

            alert("Images added to gallery!");
            if (onPublish) onPublish();
        } catch (error) {
            console.error("Error adding to gallery: ", error);
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
            <h3 style={{ marginBottom: "40px", fontWeight: "800", color: "#222", fontSize: "26px", textAlign: "center" }}>Media Gallery Upload</h3>
            
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-lg-12 mb-5">
                        <label style={labelStyle}>Image Caption / Title</label>
                        <input 
                            type="text" 
                            style={inputStyle}
                            placeholder="e.g. Community Meeting 2024" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            onFocus={(e) => e.target.style.borderBottomColor = "#ca1e14"}
                            onBlur={(e) => e.target.style.borderBottomColor = "#ddd"}
                            required 
                        />
                    </div>

                    <div className="col-lg-12 mb-5">
                        <label style={labelStyle}>Gallery Image File(s)</label>
                        <input 
                            type="file" 
                            style={{ ...inputStyle, borderBottom: "none" }}
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            required 
                        />
                        <div style={{ width: "100%", height: "2px", backgroundColor: "#ddd" }}></div>
                        {previewUrls && previewUrls.length > 0 && (
                            <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                {previewUrls.map((url, i) => (
                                    <img key={i} src={url} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "10px" }} />
                                ))}
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
                        {loading ? "Adding..." : "Confirm Upload"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminAddGallery;
