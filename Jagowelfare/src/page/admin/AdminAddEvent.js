import React, { useState } from "react";
import { supabase } from "../../supabase";

const AdminAddEvent = ({ onPublish, eventData }) => {
    const [title, setTitle] = useState("");
    const [tag, setTag] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [venue, setVenue] = useState("");
    const [imageFiles, setImageFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [loading, setLoading] = useState(false);

    const [category, setCategory] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [seatsAvailable, setSeatsAvailable] = useState("");

    const [organizerName, setOrganizerName] = useState("");
    const [organizerRole, setOrganizerRole] = useState("");
    const [organizerCompany, setOrganizerCompany] = useState("");
    const [organizerImageFile, setOrganizerImageFile] = useState(null);
    const [organizerPreview, setOrganizerPreview] = useState("");

    const fileInputRef = React.useRef(null);
    const organizerInputRef = React.useRef(null);

    // Format date for datetime-local input (YYYY-MM-DDTHH:MM)
    const formatDateTime = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const pad = (num) => String(num).padStart(2, '0');
        const y = date.getFullYear();
        const m = pad(date.getMonth() + 1);
        const d = pad(date.getDate());
        const h = pad(date.getHours());
        const min = pad(date.getMinutes());
        return `${y}-${m}-${d}T${h}:${min}`;
    };

    React.useEffect(() => {
        if (eventData) {
            setTitle(eventData.title || "");
            setTag(eventData.tag || "");
            setDescription(eventData.description || "");
            setContent(eventData.content || "");
            setStartDate(formatDateTime(eventData.startAt || eventData.start_at));
            setEndDate(formatDateTime(eventData.endAt || eventData.end_at));
            setVenue(eventData.venue || "");
            setCategory(eventData.category || "");
            setContactEmail(eventData.contactEmail || "");
            setContactPhone(eventData.contactPhone || "");
            setSeatsAvailable(eventData.seatsAvailable || "");
            setOrganizerName(eventData.organizerName || "");
            setOrganizerRole(eventData.organizerRole || "");
            setOrganizerCompany(eventData.organizerCompany || "");
            setOrganizerPreview(eventData.organizerImageUrl || "");
            
            if (eventData.image_url) {
                setPreviewUrls(eventData.image_url.split(','));
            }
        }
    }, [eventData]);

    const handleImageChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setImageFiles(prev => [...prev, ...filesArray]);

            const urls = filesArray.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...urls]);
        }
    };

    const handleOrganizerImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setOrganizerImageFile(file);
            setOrganizerPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (previewUrls.length === 0) {
            alert("Please select at least one banner image.");
            return;
        }
        setLoading(true);
        try {
            let uploadedUrls = [];
            uploadedUrls = previewUrls.filter(url => !url.startsWith('blob:'));
            if (imageFiles.length > 0) {
                for (let i = 0; i < imageFiles.length; i++) {
                    const file = imageFiles[i];
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}_banner_${i}.${fileExt}`;
                    const filePath = `events/${fileName}`;
                    const { error: uploadError } = await supabase.storage.from('JYF').upload(filePath, file);
                    if (uploadError) throw uploadError;
                    const { data: { publicUrl } } = supabase.storage.from('JYF').getPublicUrl(filePath);
                    uploadedUrls.push(publicUrl);
                }
            }

            let organizerImageUrl = organizerPreview; 
            if (organizerImageFile) {
                const fileExt = organizerImageFile.name.split('.').pop();
                const fileName = `${Date.now()}_organizer.${fileExt}`;
                const filePath = `organizers/${fileName}`;
                const { error: orgUploadError } = await supabase.storage.from('JYF').upload(filePath, organizerImageFile);
                if (orgUploadError) throw orgUploadError;
                const { data: { publicUrl } } = supabase.storage.from('JYF').getPublicUrl(filePath);
                organizerImageUrl = publicUrl;
            }

            const finalImageUrlStr = uploadedUrls.join(",");
            const eventPayload = {
                title: title.trim(),
                tag: tag.trim() || "#Event",
                description: description.trim(),
                content: content.trim(),
                venue: venue.trim(),
                image_url: finalImageUrlStr,
                startAt: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
                endAt: endDate ? new Date(endDate).toISOString() : null,
                status: "published",
                category: category.trim(),
                contactEmail: contactEmail.trim(),
                contactPhone: contactPhone.trim(),
                seatsAvailable: seatsAvailable ? parseInt(seatsAvailable) : null,
                organizerName: organizerName.trim(),
                organizerRole: organizerRole.trim(),
                organizerCompany: organizerCompany.trim(),
                organizerImageUrl: organizerImageUrl
            };

            let result;
            if (eventData && eventData.id) {
                result = await supabase.from('events').update(eventPayload).eq('id', eventData.id).select();
            } else {
                result = await supabase.from('events').insert([eventPayload]).select();
            }
            if (result.error) throw result.error;
            alert(eventData ? "Event updated successfully!" : "Event published successfully!");
            if (onPublish) onPublish();
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
        boxSizing: "border-box",
        transition: "all 0.3s"
    };

    const labelStyle = {
        fontWeight: "700",
        color: "#222",
        fontSize: "14px",
        marginBottom: "10px",
        display: "block",
        textTransform: "uppercase",
        letterSpacing: "0.5px"
    };

    const sectionHeadingStyle = {
        fontSize: "18px",
        fontWeight: "800",
        color: "#e33129",
        marginBottom: "20px",
        paddingBottom: "8px",
        borderBottom: "1px solid #eee",
        width: "100%"
    };

    const sectionContainerStyle = {
        backgroundColor: "#fcfcfc",
        padding: "25px",
        borderRadius: "15px",
        border: "1px solid #f0f0f0",
        marginBottom: "30px",
        display: "flex",
        flexWrap: "wrap",
        boxSizing: "border-box"
    };

    return (
        <div style={{ backgroundColor: "#f4f6f9", padding: "40px 20px", borderRadius: "15px", boxSizing: "border-box" }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto", backgroundColor: "#fff", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)", boxSizing: "border-box" }}>
                <h3 style={{ marginBottom: "50px", fontWeight: "800", color: "#222", fontSize: "32px", textAlign: "center" }}>
                    {eventData ? "Edit Event" : "Publish New Event"}
                </h3>

                <form onSubmit={handleSubmit} style={{ boxSizing: "border-box" }}>
                    <div style={sectionContainerStyle}>
                        <div style={sectionHeadingStyle}>Basic Information</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "30px", width: "100%", boxSizing: "border-box" }}>
                            <div>
                                <label style={labelStyle}>Event Title</label>
                                <input type="text" style={inputStyle} placeholder="e.g. Annual Charity Gala" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                            <div>
                                <label style={labelStyle}>Category</label>
                                <input type="text" style={inputStyle} placeholder="e.g. Education" value={category} onChange={(e) => setCategory(e.target.value)} />
                            </div>
                            <div>
                                <label style={labelStyle}>Tag (e.g. #Charity)</label>
                                <input type="text" style={inputStyle} placeholder="#Event" value={tag} onChange={(e) => setTag(e.target.value)} />
                            </div>
                            <div>
                                <label style={labelStyle}>Seats Available (Quantity)</label>
                                <input type="number" style={inputStyle} placeholder="e.g. 100" value={seatsAvailable} onChange={(e) => setSeatsAvailable(e.target.value)} />
                            </div>
                        </div>

                        <div style={{ width: "100%", marginTop: "30px", boxSizing: "border-box" }}>
                            <label style={labelStyle}>Event Banner Images</label>
                            <input ref={fileInputRef} type="file" style={{ display: "none" }} accept="image/*" multiple onChange={handleImageChange} />
                            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center", marginTop: "15px" }}>
                                {previewUrls.map((url, i) => (
                                    <div key={i} style={{ position: "relative" }}>
                                        <img src={url} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "15px", border: "1px solid #eee", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }} />
                                        <button type="button" onClick={() => removeImage(i)} style={{ position: "absolute", top: "-8px", right: "-8px", backgroundColor: "#e33129", color: "#fff", border: "none", borderRadius: "50%", width: "24px", height: "24px", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}>×</button>
                                    </div>
                                ))}
                                <div onClick={triggerFileInput} style={{ width: "100px", height: "100px", border: "2px dashed #ddd", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "32px", color: "#aaa", backgroundColor: "#fafafa", transition: "all 0.3s ease" }}>+</div>
                            </div>
                        </div>
                    </div>

                    <div style={sectionContainerStyle}>
                        <div style={sectionHeadingStyle}>Venue & Schedule</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px", width: "100%", boxSizing: "border-box" }}>
                            <div>
                                <label style={labelStyle}>Venue / Location</label>
                                <input type="text" style={inputStyle} placeholder="e.g. Grand Ballroom, NY" value={venue} onChange={(e) => setVenue(e.target.value)} required />
                            </div>
                            <div>
                                <label style={labelStyle}>Starts At</label>
                                <input type="datetime-local" style={inputStyle} value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                            </div>
                            <div>
                                <label style={labelStyle}>Ends At (Optional)</label>
                                <input type="datetime-local" style={inputStyle} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div style={sectionContainerStyle}>
                        <div style={sectionHeadingStyle}>Contact Information</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "30px", width: "100%", boxSizing: "border-box" }}>
                            <div>
                                <label style={labelStyle}>Contact Email</label>
                                <input type="email" style={inputStyle} placeholder="register@example.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                            </div>
                            <div>
                                <label style={labelStyle}>Contact Phone</label>
                                <input type="tel" style={inputStyle} placeholder="+1 234 567 890" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div style={sectionContainerStyle}>
                        <div style={sectionHeadingStyle}>Event Organizer</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px", width: "100%", boxSizing: "border-box" }}>
                            <div>
                                <label style={labelStyle}>Organizer Name</label>
                                <input type="text" style={inputStyle} placeholder="e.g. Mike Richard" value={organizerName} onChange={(e) => setOrganizerName(e.target.value)} />
                            </div>
                            <div>
                                <label style={labelStyle}>Role / Designation</label>
                                <input type="text" style={inputStyle} placeholder="e.g. Managing Director" value={organizerRole} onChange={(e) => setOrganizerRole(e.target.value)} />
                            </div>
                            <div>
                                <label style={labelStyle}>Company / Group</label>
                                <input type="text" style={inputStyle} placeholder="e.g. Care NGO Ltd." value={organizerCompany} onChange={(e) => setOrganizerCompany(e.target.value)} />
                            </div>
                        </div>
                        <div style={{ width: "100%", marginTop: "20px", boxSizing: "border-box" }}>
                            <label style={labelStyle}>Organizer Profile Image</label>
                            <input ref={organizerInputRef} type="file" style={{ display: "none" }} accept="image/*" onChange={handleOrganizerImageChange} />
                            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginTop: "10px" }}>
                                {organizerPreview ? (
                                    <div style={{ position: "relative" }}>
                                        <img src={organizerPreview} alt="Organizer" style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "2px solid #e33129" }} />
                                        <button type="button" onClick={() => { setOrganizerImageFile(null); setOrganizerPreview(""); }} style={{ position: "absolute", top: "0", right: "0", backgroundColor: "#333", color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", fontSize: "12px", cursor: "pointer" }}>×</button>
                                    </div>
                                ) : (
                                    <div onClick={() => organizerInputRef.current.click()} style={{ width: "80px", height: "80px", borderRadius: "50%", border: "2px dashed #ddd", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#999" }}><i className="fas fa-camera"></i></div>
                                )}
                                <span className="text-muted small">Only 1 photo (Clear Profile Picture)</span>
                            </div>
                        </div>
                    </div>

                    <div style={sectionContainerStyle}>
                        <div style={sectionHeadingStyle}>Description & Content</div>
                        <div style={{ width: "100%", boxSizing: "border-box" }}>
                            <div className="mb-4">
                                <label style={labelStyle}>Short Description</label>
                                <textarea style={{ ...inputStyle, minHeight: "80px", border: "1px solid #ddd", padding: "15px", borderRadius: "10px", resize: "none" }} placeholder="A brief sentence about the event..." value={description} onChange={(e) => setDescription(e.target.value)} required />
                            </div>
                            <div>
                                <label style={labelStyle}>Detailed Content</label>
                                <textarea style={{ ...inputStyle, minHeight: "150px", border: "1px solid #ddd", padding: "15px", borderRadius: "10px", resize: "none" }} placeholder="Explain the event in full detail..." value={content} onChange={(e) => setContent(e.target.value)} required />
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-5">
                        <button type="submit" className="btn btn_theme btn_md" style={{ padding: "18px 100px", borderRadius: "50px", fontWeight: "800", fontSize: "18px", textTransform: "uppercase", letterSpacing: "1.5px", boxShadow: "0 15px 35px rgba(227, 49, 41, 0.25)", transition: "all 0.3s ease" }} disabled={loading}>
                            {loading ? (eventData ? "Updating..." : "Publishing...") : (eventData ? "Update Event" : "Publish Event")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAddEvent;
