import React, { useState } from "react";
import { supabase } from "../../supabase";

const AdminAddGallery = ({ onPublish }) => {
    const [title, setTitle] = useState("");
    const [imageFiles, setImageFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [loading, setLoading] = useState(false);

    const fileInputRef = React.useRef(null);

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
                    const { error } = await supabase.storage.from('JYF').upload(filePath, file);
                    if (error) throw error;
                    const { data: { publicUrl } } = supabase.storage.from('JYF').getPublicUrl(filePath);
                    uploadedUrls.push(publicUrl);
                }
            }
            const insertData = uploadedUrls.map(url => ({ title: title, image_url: url }));
            if (insertData.length > 0) {
                const { error: insertError } = await supabase.from('gallery').insert(insertData);
                if (insertError) throw insertError;
            }
            alert("Images added to gallery successfully!");
            if (onPublish) onPublish();
        } catch (error) {
            alert("Submission failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { border: "none", borderBottom: "2px solid #ddd", borderRadius: "0", padding: "12px 0", backgroundColor: "transparent", fontSize: "16px", outline: "none", width: "100%", transition: "all 0.3s" };
    const labelStyle = { fontWeight: "700", color: "#222", fontSize: "14px", marginBottom: "10px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" };
    const sectionHeadingStyle = { fontSize: "18px", fontWeight: "800", color: "#e33129", marginBottom: "20px", paddingBottom: "8px", borderBottom: "1px solid #eee", width: "100%" };
    const sectionContainerStyle = { backgroundColor: "#fcfcfc", padding: "25px", borderRadius: "15px", border: "1px solid #f0f0f0", marginBottom: "30px" };

    return (
        <div style={{ backgroundColor: "#f4f6f9", padding: "40px 20px", borderRadius: "15px" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "#fff", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
                <h3 style={{ marginBottom: "50px", fontWeight: "800", color: "#222", fontSize: "32px", textAlign: "center" }}>Add Media Gallery</h3>
                
                <form onSubmit={handleSubmit}>
                    <div style={sectionContainerStyle}>
                        <div style={sectionHeadingStyle}>Gallery Item Info</div>
                        <div className="mb-4">
                            <label style={labelStyle}>Caption / Title</label>
                            <input type="text" style={inputStyle} placeholder="e.g. Community Event 2024" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>

                        <div style={{ marginTop: "30px" }}>
                            <label style={labelStyle}>Gallery Image(s)</label>
                            <input ref={fileInputRef} type="file" style={{ display: "none" }} accept="image/*" multiple onChange={handleImageChange} />
                            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center", marginTop: "15px" }}>
                                {previewUrls.map((url, i) => (
                                    <img key={i} src={url} alt="Preview" style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "15px", border: "1px solid #eee" }} />
                                ))}
                                <div onClick={() => fileInputRef.current.click()} style={{ width: "120px", height: "120px", border: "2px dashed #ddd", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "32px", color: "#aaa", backgroundColor: "#fafafa" }}>+</div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-5">
                        <button type="submit" className="btn btn_theme btn_md" style={{ padding: "18px 100px", borderRadius: "50px", fontWeight: "800", fontSize: "18px", textTransform: "uppercase", letterSpacing: "1.5px", boxShadow: "0 15px 35px rgba(227, 49, 41, 0.25)" }} disabled={loading}>
                            {loading ? "Adding..." : "Confirm Upload"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAddGallery;
