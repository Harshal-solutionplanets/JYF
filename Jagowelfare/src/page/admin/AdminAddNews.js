import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";

const AdminAddNews = ({ onPublish }) => {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
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
                const imageRef = ref(storage, `news/${Date.now()}_${imageFile.name}`);
                const uploadResult = await uploadBytes(imageRef, imageFile);
                imageUrl = await getDownloadURL(uploadResult.ref);
            }

            await addDoc(collection(db, "news"), {
                title,
                summary,
                content,
                imageUrl,
                createdAt: serverTimestamp()
            });

            alert("News article published successfully!");
            if (onPublish) onPublish();
        } catch (error) {
            console.error("Error adding news: ", error);
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
            <h3 style={{ marginBottom: "40px", fontWeight: "800", color: "#222", fontSize: "26px", textAlign: "center" }}>Article Submission</h3>
            
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-lg-12 mb-5">
                        <label style={labelStyle}>Headlines / Title</label>
                        <input 
                            type="text" 
                            style={inputStyle}
                            placeholder="e.g. New Hospital Project Launched" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            onFocus={(e) => e.target.style.borderBottomColor = "#e33129"}
                            onBlur={(e) => e.target.style.borderBottomColor = "#ddd"}
                            required 
                        />
                    </div>

                    <div className="col-lg-12 mb-5">
                        <label style={labelStyle}>Article Image</label>
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
                                <img src={previewUrl} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "10px" }} />
                            </div>
                        )}
                    </div>

                    <div className="col-lg-12 mb-5">
                        <label style={labelStyle}>Short Summary</label>
                        <input 
                            type="text" 
                            style={inputStyle}
                            placeholder="A brief sentence about the article..." 
                            value={summary} 
                            onChange={(e) => setSummary(e.target.value)} 
                            onFocus={(e) => e.target.style.borderBottomColor = "#e33129"}
                            onBlur={(e) => e.target.style.borderBottomColor = "#ddd"}
                            required 
                        />
                    </div>

                    <div className="col-lg-12 mb-5">
                        <label style={labelStyle}>Article Body Content</label>
                        <textarea 
                            style={{ ...inputStyle, minHeight: "150px" }}
                            placeholder="Type the full details of the news article..." 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
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
                        {loading ? "Publishing..." : "Publish Article"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminAddNews;
