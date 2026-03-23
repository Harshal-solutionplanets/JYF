import React, { useState, useRef } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from "../../supabase";

const AdminAddCause = ({ onPublish }) => {
    const [title, setTitle] = useState("");
    const [tag, setTag] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [goal, setGoal] = useState("");
    const [imageFiles, setImageFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    };

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
                    const filePath = `causes/${fileName}`;
                    const { error: uploadError } = await supabase.storage.from('JYF').upload(filePath, file);
                    if (uploadError) throw uploadError;
                    const { data: { publicUrl } } = supabase.storage.from('JYF').getPublicUrl(filePath);
                    uploadedUrls.push(publicUrl);
                }
            }
            
            const finalImageUrlStr = uploadedUrls.join(",");

            const { error: insertError } = await supabase.from('causes').insert([{
                title: title.trim(),
                tag: tag.trim() || "#Cause",
                description: description.trim(),
                content: content.trim(),
                goal: parseFloat(goal),
                raised: 0,
                image_url: finalImageUrlStr,
                status: "published"
            }]);

            if (insertError) throw insertError;
            alert("New Cause Published successfully!");
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
            <style>
                {`
                    .ql-container { min-height: 150px; font-size: 16px; font-family: inherit; }
                    .ql-editor { min-height: 150px; }
                `}
            </style>
            <div style={{ maxWidth: "1000px", margin: "0 auto", backgroundColor: "#fff", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
                <h3 style={{ marginBottom: "50px", fontWeight: "800", color: "#222", fontSize: "32px", textAlign: "center" }}>Post a New Cause</h3>
                
                <form onSubmit={handleSubmit}>
                    <div style={sectionContainerStyle}>
                        <div style={sectionHeadingStyle}>Basic Information</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "30px" }}>
                            <div>
                                <label style={labelStyle}>Cause Title</label>
                                <input type="text" style={inputStyle} placeholder="e.g. Children Education" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                            <div>
                                <label style={labelStyle}>Category / Tag</label>
                                <input type="text" style={inputStyle} placeholder="#Cause" value={tag} onChange={(e) => setTag(e.target.value)} />
                            </div>
                            <div>
                                <label style={labelStyle}>Funding Goal ($)</label>
                                <input type="number" style={inputStyle} placeholder="e.g. 5000" value={goal} onChange={(e) => setGoal(e.target.value)} required />
                            </div>
                        </div>

                        <div style={{ marginTop: "30px" }}>
                            <label style={labelStyle}>Cause Image (Banner)</label>
                            <input ref={fileInputRef} type="file" style={{ display: "none" }} accept="image/*" onChange={handleImageChange} />
                            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center", marginTop: "15px" }}>
                                {previewUrls.map((url, i) => (
                                    <img key={i} src={url} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "15px", border: "1px solid #eee" }} />
                                ))}
                                <div onClick={() => fileInputRef.current.click()} style={{ width: "100px", height: "100px", border: "2px dashed #ddd", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "32px", color: "#aaa", backgroundColor: "#fafafa" }}>+</div>
                            </div>
                        </div>
                    </div>

                    <div style={sectionContainerStyle}>
                        <div style={sectionHeadingStyle}>Description & Content</div>
                        <div className="mb-4">
                            <label style={labelStyle}>Short Summary</label>
                            <ReactQuill theme="snow" value={description} onChange={(val) => { if(val !== description) setDescription(val); }} modules={quillModules} style={{ backgroundColor: "#fff" }} />
                        </div>
                        <div>
                            <label style={labelStyle}>Detailed Story</label>
                            <ReactQuill theme="snow" value={content} onChange={(val) => { if(val !== content) setContent(val); }} modules={quillModules} style={{ backgroundColor: "#fff" }} />
                        </div>
                    </div>

                    <div className="text-center mt-5">
                        <button type="submit" className="btn btn_theme btn_md" style={{ padding: "18px 100px", borderRadius: "50px", fontWeight: "800", fontSize: "18px", textTransform: "uppercase", letterSpacing: "1.5px", boxShadow: "0 15px 35px rgba(227, 49, 41, 0.25)" }} disabled={loading}>
                            {loading ? "Publishing..." : "Publish Cause"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAddCause;
