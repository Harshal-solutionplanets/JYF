import React, { useState } from "react";
import { supabase } from "../../supabase";

const AdminAddEvent = ({ onPublish }) => {
    const [title, setTitle] = useState("");
    const [tag, setTag] = useState("");
    const [description, setDescription] = useState(""); // Short summary
    const [content, setContent] = useState("");     // Detailed article body
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [venue, setVenue] = useState("");
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
                    const filePath = `events/${fileName}`;

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

            const finalImageUrlStr = uploadedUrls.join(",");

            const { data: insertedEvent, error: insertError } = await supabase
                .from('events')
                .insert([{
                    title: title.trim(),
                    tag: tag.trim() || "#Event",
                    description: description.trim(),
                    content: content.trim(),
                    location: venue.trim(),
                    image_url: finalImageUrlStr,
                    start_at: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
                    end_at: endDate ? new Date(endDate).toISOString() : null,
                    status: "published"
                }])
                .select();


            if (insertError) throw insertError;

            alert("Event and Details published successfully to Supabase!");
            
            if (insertedEvent && insertedEvent.length > 0) {
                // Redirect user to the event details page to view the newly created event
                window.location.href = `/event/${insertedEvent[0].id}`;
            } else if (onPublish) {
                onPublish();
            }
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
            <h3 style={{ marginBottom: "40px", fontWeight: "800", color: "#222", fontSize: "26px", textAlign: "center" }}>Detailed Event</h3>
            
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-lg-8 mb-4">
                        <label style={labelStyle}>Event Title</label>
                        <input 
                            type="text" 
                            style={inputStyle}
                            placeholder="e.g. Annual Charity Gala" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            onFocus={(e) => e.target.style.borderBottomColor = "#ca1e14"}
                            onBlur={(e) => e.target.style.borderBottomColor = "#ddd"}
                            required 
                        />
                    </div>
                    <div className="col-lg-4 mb-4">
                        <label style={labelStyle}>Tag (e.g. #Charity)</label>
                        <input 
                            type="text" 
                            style={inputStyle}
                            placeholder="#Event" 
                            value={tag} 
                            onChange={(e) => setTag(e.target.value)} 
                            onFocus={(e) => e.target.style.borderBottomColor = "#e33129"}
                            onBlur={(e) => e.target.style.borderBottomColor = "#ddd"}
                        />
                    </div>

                    <div className="col-lg-12 mb-4">
                        <label style={labelStyle}>Event Banner Image</label>
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

                    <div className="col-lg-6 mb-4">
                        <label style={labelStyle}>Venue / Location</label>
                        <input 
                            type="text" 
                            style={inputStyle}
                            placeholder="e.g. Grand Ballroom, NY" 
                            value={venue} 
                            onChange={(e) => setVenue(e.target.value)} 
                            onFocus={(e) => e.target.style.borderBottomColor = "#e33129"}
                            onBlur={(e) => e.target.style.borderBottomColor = "#ddd"}
                            required 
                        />
                    </div>

                    <div className="col-lg-3 mb-4">
                        <label style={labelStyle}>Starts At</label>
                        <input 
                            type="datetime-local" 
                            style={inputStyle}
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                            onFocus={(e) => e.target.style.borderBottomColor = "#e33129"}
                            onBlur={(e) => e.target.style.borderBottomColor = "#ddd"}
                            required 
                        />
                    </div>

                    <div className="col-lg-3 mb-4">
                        <label style={labelStyle}>Ends At (Optional)</label>
                        <input 
                            type="datetime-local" 
                            style={inputStyle}
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                            onFocus={(e) => e.target.style.borderBottomColor = "#e33129"}
                            onBlur={(e) => e.target.style.borderBottomColor = "#ddd"}
                        />
                    </div>

                    <div className="col-lg-12 mb-4">
                        <label style={labelStyle}>Short Description (Summary)</label>
                        <input 
                            type="text" 
                            style={inputStyle}
                            placeholder="A brief sentence about the event..." 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            onFocus={(e) => e.target.style.borderBottomColor = "#ca1e14"}
                            onBlur={(e) => e.target.style.borderBottomColor = "#ddd"}
                            required 
                        />
                    </div>

                    <div className="col-lg-12 mb-4">
                        <label style={labelStyle}>Event Detailed Content (Long Body)</label>
                        <textarea 
                            style={{ ...inputStyle, minHeight: "150px" }}
                            placeholder="Explain the event in full detail..." 
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
                        {loading ? "Publishing..." : "Publish Event"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminAddEvent;
