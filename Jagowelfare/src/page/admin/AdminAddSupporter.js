import React, { useState } from "react";
import { supabase } from "../../supabase";

const AdminAddSupporter = ({ onPublish, supporterData }) => {
    const [name, setName] = useState(supporterData?.name || "");
    const [websiteUrl, setWebsiteUrl] = useState(supporterData?.website_url || "");
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(supporterData?.image_url || "");
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
            let imageUrl = supporterData?.image_url || "";
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const filePath = `supporters/${fileName}`;
                const { error } = await supabase.storage.from('JYF').upload(filePath, imageFile);
                if (error) throw error;
                const { data } = supabase.storage.from('JYF').getPublicUrl(filePath);
                imageUrl = data.publicUrl;
            }
            
            const payload = { 
                name, 
                website_url: websiteUrl,
                image_url: imageUrl 
            };

            if (supporterData?.id) {
                const { error } = await supabase.from('supporters').update(payload).eq('id', supporterData.id);
                if (error) throw error;
                alert("Supporter updated success!");
            } else {
                const { error } = await supabase.from('supporters').insert([payload]);
                if (error) throw error;
                alert("Supporter added success!");
            }
            
            if (onPublish) onPublish();
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { border: "none", borderBottom: "2px solid #ddd", borderRadius: "0", padding: "12px 0", backgroundColor: "transparent", fontSize: "16px", outline: "none", width: "100%" };
    const labelStyle = { fontWeight: "700", color: "#222", fontSize: "14px", marginBottom: "10px", display: "block" };

    return (
        <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)", maxWidth: "600px", margin: "0 auto" }}>
            <h3 style={{ marginBottom: "30px", fontWeight: "800", color: "#222" }}>{supporterData ? "Edit Supporter" : "Add New Supporter"}</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "25px" }}>
                    <label style={labelStyle}>Supporter Name / Company</label>
                    <input type="text" style={inputStyle} placeholder="e.g. Reliance Foundation" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div style={{ marginBottom: "25px" }}>
                    <label style={labelStyle}>Supporter Website / Company Link</label>
                    <input type="url" style={inputStyle} placeholder="e.g. https://www.google.com" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
                </div>

                <div style={{ marginBottom: "30px" }}>
                    <label style={labelStyle}>Logo / Image</label>
                    <input ref={fileInputRef} type="file" style={{ display: "none" }} accept="image/*" onChange={handleImageChange} />
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" style={{ width: "120px", height: "120px", objectFit: "contain", border: "1px solid #eee", padding: "5px" }} />
                        ) : (
                            <div onClick={() => fileInputRef.current.click()} style={{ width: "120px", height: "80px", border: "2px dashed #ddd", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#aaa" }}>
                                <i className="fas fa-plus"></i> Logo
                            </div>
                        )}
                        <button type="button" onClick={() => fileInputRef.current.click()} className="btn btn-sm btn-dark">Select Image</button>
                    </div>
                </div>

                <button type="submit" className="btn btn_theme btn_md w-100" disabled={loading}>
                    {loading ? "Saving..." : (supporterData ? "Update Supporter" : "Add Supporter")}
                </button>
            </form>
        </div>
    );
};

export default AdminAddSupporter;
