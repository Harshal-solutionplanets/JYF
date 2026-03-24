import React, { useState, useRef, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from "../../supabase";

const AdminAddCause = ({ onPublish, causeData }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    
    // Sidebar Key-Value fields (Limit 20 characters)
    const [infokey1, setInfokey1] = useState("Category");
    const [infoval1, setInfoval1] = useState("");
    const [infokey2, setInfokey2] = useState("Location");
    const [infoval2, setInfoval2] = useState("");
    const [infokey3, setInfokey3] = useState("Date");
    const [infoval3, setInfoval3] = useState("");

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

    useEffect(() => {
        if (causeData) {
            setTitle(causeData.title || "");
            setDescription(causeData.description || "");
            setContent(causeData.content || "");
            setInfokey1(causeData.infokey1 || "Category");
            setInfoval1(causeData.infoval1 || "");
            setInfokey2(causeData.infokey2 || "Location");
            setInfoval2(causeData.infoval2 || "");
            setInfokey3(causeData.infokey3 || "Date");
            setInfoval3(causeData.infoval3 || "");
            if (causeData.image_url) {
                setPreviewUrls(causeData.image_url.split(','));
            }
        }
    }, [causeData]);

    const handleImageChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setImageFiles(prev => [...prev, ...filesArray]);
            const urls = filesArray.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...urls]);
        }
    };

    const removeImage = (index) => {
        const removedUrl = previewUrls[index];
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
        // If it was a newly selected file, remove it from imageFiles too
        // We match by URL if it's blob, otherwise it's an existing URL
        setImageFiles(prev => prev.filter(file => URL.createObjectURL(file) !== removedUrl));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Keep existing URLs (those that don't start with blob:)
            let finalPreviews = previewUrls.filter(url => !url.startsWith('blob:'));
            
            // Upload new files
            if (imageFiles.length > 0) {
                for (let i = 0; i < imageFiles.length; i++) {
                    const file = imageFiles[i];
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}_${i}.${fileExt}`;
                    const filePath = `causes/${fileName}`;
                    const { error: uploadError } = await supabase.storage.from('JYF').upload(filePath, file);
                    if (uploadError) throw uploadError;
                    const { data: { publicUrl } } = supabase.storage.from('JYF').getPublicUrl(filePath);
                    finalPreviews.push(publicUrl);
                }
            }
            
            const finalImageUrlStr = finalPreviews.join(",");

            const payload = {
                title: title.trim(),
                description: description.trim(),
                content: content.trim(),
                image_url: finalImageUrlStr,
                infokey1: infokey1.trim(),
                infoval1: infoval1.trim(),
                infokey2: infokey2.trim(),
                infoval2: infoval2.trim(),
                infokey3: infokey3.trim(),
                infoval3: infoval3.trim(),
                status: "published"
            };

            if (causeData && causeData.id) {
                const { error: updateError } = await supabase
                    .from('causes')
                    .update(payload)
                    .eq('id', causeData.id);
                if (updateError) throw updateError;
                alert("Cause updated successfully!");
            } else {
                const { error: insertError } = await supabase
                    .from('causes')
                    .insert([payload]);
                if (insertError) throw insertError;
                alert("New Cause Published successfully!");
            }
            
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
                <h3 style={{ marginBottom: "50px", fontWeight: "800", color: "#222", fontSize: "32px", textAlign: "center" }}>
                    {causeData ? "Edit Cause Details" : "Post a New Cause"}
                </h3>
                
                <form onSubmit={handleSubmit}>
                    <div style={sectionContainerStyle}>
                        <div style={sectionHeadingStyle}>Basic Information</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "30px" }}>
                            <div>
                                <label style={labelStyle}>Cause Title</label>
                                <input type="text" style={inputStyle} placeholder="e.g. Children Education" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                        </div>

                        <div style={{ marginTop: "40px" }}>
                            <label style={labelStyle}>Cause Principal Image (Required)</label>
                            <p style={{ fontSize: "13px", color: "#666", marginTop: "-5px" }}>Recommended: High-quality landscape image (approx. 930x480px) for the main details page.</p>
                            <input ref={fileInputRef} type="file" style={{ display: "none" }} accept="image/*" multiple onChange={handleImageChange} />
                            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center", marginTop: "15px" }}>
                                {previewUrls.map((url, i) => (
                                    <div key={i} style={{ position: "relative" }}>
                                        <img src={url} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "15px", border: "1px solid #eee" }} />
                                        <button type="button" onClick={() => removeImage(i)} style={{ position: "absolute", top: "-10px", right: "-10px", backgroundColor: "#e33129", color: "#fff", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>×</button>
                                    </div>
                                ))}
                                <div onClick={() => fileInputRef.current.click()} style={{ width: "100px", height: "100px", border: "2px dashed #ddd", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "32px", color: "#aaa", backgroundColor: "#fafafa" }}>+</div>
                            </div>
                        </div>
                    </div>

                    <div style={sectionContainerStyle}>
                        <div style={sectionHeadingStyle}>Sidebar Details (At a Glance Stats)</div>
                        <p style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>These 3 fields will be shown in the sidebar box on the details page. (Limit: 40 characters per field)</p>
                        
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{...labelStyle, fontSize: "12px"}}>Point 1</label>
                            <input type="text" style={inputStyle} value={infoval1} onChange={(e) => setInfoval1(e.target.value.slice(0, 40))} placeholder="e.g. Started treating 50+ patients/day" />
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{...labelStyle, fontSize: "12px"}}>Point 2</label>
                            <input type="text" style={inputStyle} value={infoval2} onChange={(e) => setInfoval2(e.target.value.slice(0, 40))} placeholder="e.g. Operating in Mulund, Mumbai" />
                        </div>

                        <div style={{ marginBottom: "0" }}>
                            <label style={{...labelStyle, fontSize: "12px"}}>Point 3</label>
                            <input type="text" style={inputStyle} value={infoval3} onChange={(e) => setInfoval3(e.target.value.slice(0, 40))} placeholder="e.g. Campaign ending on 20 Dec, 2024" />
                        </div>
                    </div>

                    <div style={sectionContainerStyle}>
                        <div style={sectionHeadingStyle}>Description & Content</div>
                        <div className="mb-4">
                            <label style={labelStyle}>Short Summary (Introduction)</label>
                            <ReactQuill theme="snow" value={description} onChange={(val) => { if(val !== description) setDescription(val); }} modules={quillModules} style={{ backgroundColor: "#fff" }} />
                        </div>
                        <div>
                            <label style={labelStyle}>Detailed Story (Full Page Content)</label>
                            <ReactQuill theme="snow" value={content} onChange={(val) => { if(val !== content) setContent(val); }} modules={quillModules} style={{ backgroundColor: "#fff" }} />
                        </div>
                    </div>

                    <div className="text-center mt-5">
                        <button type="submit" className="btn btn_theme btn_md" style={{ padding: "18px 100px", borderRadius: "50px", fontWeight: "800", fontSize: "18px", textTransform: "uppercase", letterSpacing: "1.5px", boxShadow: "0 15px 35px rgba(227, 49, 41, 0.25)" }} disabled={loading}>
                            {loading ? "Processing..." : (causeData ? "Update Cause" : "Publish Cause")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAddCause;
