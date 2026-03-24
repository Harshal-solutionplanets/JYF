import React, { useState, useEffect, useRef } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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

    const [sections, setSections] = useState([]);

    const [organizerName, setOrganizerName] = useState("");
    const [organizerRole, setOrganizerRole] = useState("");
    const [organizerCompany, setOrganizerCompany] = useState("");
    const [organizerImageFile, setOrganizerImageFile] = useState(null);
    const [organizerPreview, setOrganizerPreview] = useState("");

    const [categoryMasters, setCategoryMasters] = useState([]);
    const [seatTierMasters, setSeatTierMasters] = useState([]);

    const fileInputRef = useRef(null);
    const organizerInputRef = useRef(null);

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "";
        const pad = (num) => String(num).padStart(2, '0');
        const y = date.getFullYear();
        const m = pad(date.getMonth() + 1);
        const d = pad(date.getDate());
        const h = pad(date.getHours());
        const min = pad(date.getMinutes());
        return `${y}-${m}-${d}T${h}:${min}`;
    };

    const fetchMasters = async () => {
        try {
            const { data, error } = await supabase.from('masters').select('*');
            if (error) throw error;
            setCategoryMasters(data.filter(m => m.type === 'event_category').map(m => m.value));
            setSeatTierMasters(data.filter(m => m.type === 'seat_tier').map(m => m.value));
        } catch (e) {
            console.error("Error fetching masters:", e);
        }
    };

    useEffect(() => {
        fetchMasters();
    }, []);

    useEffect(() => {
        if (eventData) {
            setTitle(eventData.title || "");
            setTag(eventData.tag || "");
            let desc = eventData.description || "";
            if (desc.startsWith("SECTIONS:")) {
                try {
                    const parts = desc.split(" | CONTENT: ");
                    const sectionsJson = parts[0].replace("SECTIONS: ", "");
                    const parsedSections = JSON.parse(sectionsJson);
                    if (!Array.isArray(parsedSections)) {
                        const arr = Object.keys(parsedSections)
                            .filter(k => parsedSections[k].enabled)
                            .map((k, i) => ({ id: Date.now() + i, name: k, seats: parsedSections[k].seats }));
                        setSections(arr);
                    } else {
                        setSections(parsedSections);
                    }
                    setDescription(parts[1] || "");
                } catch (e) { setDescription(desc); }
            } else { setDescription(desc); }

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
            if (eventData.image_url) { setPreviewUrls(eventData.image_url.split(',')); }
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

    const replaceImage = (index, file) => {
        const url = URL.createObjectURL(file);
        setPreviewUrls(prev => prev.map((u, i) => i === index ? url : u));
        setImageFiles(prev => {
            const newFiles = [...prev];
            newFiles[index] = file;
            return newFiles;
        });
    };

    const [showTierDropdown, setShowTierDropdown] = useState(false);

    const addSectionWithName = (name) => {
        const totalSeatsInput = parseInt(seatsAvailable) || 0;
        const currentSum = sections.reduce((acc, s) => acc + (parseInt(s.seats) || 0), 0);
        if (currentSum >= totalSeatsInput && totalSeatsInput > 0) {
            alert("Cannot add more sections. Total seats already matched!");
            return;
        }
        setSections(prev => [...prev, { id: Date.now(), name: name || "", seats: "" }]);
    };

    const updateSection = (id, field, value) => {
        setSections(prev => prev.map(s => {
            if (s.id === id) {
                if (field === 'seats') {
                    const parsed = parseInt(value);
                    if (value !== "" && parsed < 0) return s;
                    const otherSum = prev.filter(sec => sec.id !== id).reduce((acc, sec) => acc + (parseInt(sec.seats) || 0), 0);
                    const totalAllowed = parseInt(seatsAvailable) || 0;
                    if (totalAllowed > 0 && otherSum + (parsed || 0) > totalAllowed) {
                        alert(`Cannot allocate more than ${totalAllowed} seats in total!`);
                        return s;
                    }
                    return { ...s, seats: value === "" ? "" : parsed };
                }
                return { ...s, [field]: value };
            }
            return s;
        }));
    };

    const removeSection = (id) => { setSections(prev => prev.filter(s => s.id !== id)); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const totalSeatsInput = seatsAvailable ? parseInt(seatsAvailable) : 0;
        const sumSectionSeats = sections.reduce((acc, s) => acc + (s.seats || 0), 0);
        if (totalSeatsInput > 0 && sumSectionSeats !== totalSeatsInput) {
            alert(`number is not matched! Total seats is ${totalSeatsInput}, but sections sum to ${sumSectionSeats}.`);
            return;
        }
        if (previewUrls.length === 0) { alert("Please select at least one banner image."); return; }
        setLoading(true);
        try {
            let uploadedUrls = previewUrls.filter(url => !url.startsWith('blob:'));
            if (imageFiles.length > 0) {
                for (let i = 0; i < imageFiles.length; i++) {
                    const file = imageFiles[i];
                    const fileName = `${Date.now()}_banner_${i}.${file.name.split('.').pop()}`;
                    const filePath = `events/${fileName}`;
                    const { error } = await supabase.storage.from('JYF').upload(filePath, file);
                    if (error) throw error;
                    const { data: { publicUrl } } = supabase.storage.from('JYF').getPublicUrl(filePath);
                    uploadedUrls.push(publicUrl);
                }
            }
            let organizerImageUrl = organizerPreview;
            if (organizerImageFile) {
                const fileName = `${Date.now()}_organizer.${organizerImageFile.name.split('.').pop()}`;
                const filePath = `organizers/${fileName}`;
                const { error: orgUploadError } = await supabase.storage.from('JYF').upload(filePath, organizerImageFile);
                if (orgUploadError) throw orgUploadError;
                const { data: { publicUrl } } = supabase.storage.from('JYF').getPublicUrl(filePath);
                organizerImageUrl = publicUrl;
            }
            const finalDescription = `SECTIONS: ${JSON.stringify(sections)} | CONTENT: ${description.trim()}`;
            const eventPayload = {
                title: title.trim(),
                tag: tag.trim() || "#Event",
                description: finalDescription,
                content: content.trim(),
                venue: venue.trim(),
                image_url: uploadedUrls.join(","),
                startAt: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
                endAt: endDate ? new Date(endDate).toISOString() : null,
                status: "published",
                category: category.trim(),
                contactEmail: contactEmail.trim(),
                contactPhone: contactPhone.trim(),
                seatsAvailable: totalSeatsInput,
                organizerName: organizerName.trim(),
                organizerRole: organizerRole.trim(),
                organizerCompany: organizerCompany.trim(),
                organizerImageUrl: organizerImageUrl
            };
            if (eventData && eventData.id) { await supabase.from('events').update(eventPayload).eq('id', eventData.id); } else { await supabase.from('events').insert([eventPayload]); }
            alert(eventData ? "Event updated successfully!" : "Event published successfully!");
            if (onPublish) onPublish();
        } finally { setLoading(false); }
    };

    const inputStyle = { border: "none", borderBottom: "2px solid #ddd", borderRadius: "0", padding: "12px 0", backgroundColor: "transparent", fontSize: "16px", outline: "none", width: "100%", boxSizing: "border-box", transition: "all 0.3s" };
    const labelStyle = { fontWeight: "700", color: "#222", fontSize: "14px", marginBottom: "10px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" };
    const actionButtonStyle = { padding: "4px 10px", fontSize: "12px", borderRadius: "4px", cursor: "pointer", border: "none", fontWeight: "600", color: "#444", backgroundColor: "#f0f0f0", transition: "0.2s" };
    const sectionHeadingStyle = { fontSize: "18px", fontWeight: "800", color: "#e33129", marginBottom: "20px", paddingBottom: "8px", borderBottom: "1px solid #eee", width: "100%" };
    const sectionContainerStyle = { backgroundColor: "#fcfcfc", padding: "25px", borderRadius: "15px", border: "1px solid #f0f0f0", marginBottom: "30px", display: "flex", flexWrap: "wrap", boxSizing: "border-box" };

    return (
        <div style={{ backgroundColor: "#f4f6f9", padding: "40px 20px", borderRadius: "15px", boxSizing: "border-box" }}>
            <style>
                {`
                    input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                    input[type=number] { -moz-appearance: textfield; }
                    .ql-container { min-height: 150px; font-size: 16px; font-family: inherit; }
                    .ql-editor { min-height: 150px; }
                    .rtf-container { margin-bottom: 25px; }
                    .rtf-label { font-weight: 700; color: #222; font-size: 14px; margin-bottom: 10px; display: block; text-transform: uppercase; }
                `}
            </style>
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
                                <label style={labelStyle}>Event Category</label>
                                <select style={{ ...inputStyle, appearance: "none", cursor: "pointer", padding: "12px 0" }} value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="">Select Category</option>
                                    {categoryMasters.map((cat, i) => (<option key={i} value={cat}>{cat}</option>))}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Tag (e.g. #Charity)</label>
                                <input type="text" style={inputStyle} placeholder="#Event" value={tag} onChange={(e) => setTag(e.target.value)} />
                            </div>
                            <div>
                                <label style={labelStyle}>Seats Available (Quantity)</label>
                                <input type="number" style={inputStyle} placeholder="e.g. 1700" value={seatsAvailable} onChange={(e) => setSeatsAvailable(e.target.value.replace(/\D/g, ''))} />
                            </div>
                        </div>

                        <div style={{ width: "100%", marginTop: "30px", boxSizing: "border-box" }}>
                            <label style={labelStyle}>Section of Seats (Add & Manage)</label>
                            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "25px", flexWrap: "wrap", position: "relative" }}>
                                <div style={{ minWidth: "250px", position: "relative" }}>
                                    <div onClick={() => setShowTierDropdown(!showTierDropdown)} style={{ ...inputStyle, padding: "12px", borderRadius: "8px", border: "1px solid #ddd", cursor: "pointer", display: "flex", justifyContent: "space-between", backgroundColor: "#fff" }}>
                                        <span style={{ color: "#999" }}>Select Tiers...</span>
                                        <span>{showTierDropdown ? "▲" : "▼"}</span>
                                    </div>
                                    {showTierDropdown && (
                                        <div style={{ position: "absolute", top: "100%", left: "0", right: "0", zIndex: "1000", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "8px", marginTop: "5px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", padding: "10px", maxHeight: "300px", overflowY: "auto" }}>
                                            {seatTierMasters.map(name => {
                                                const isAlreadyAdded = sections.find(s => s.name === name);
                                                return (<div key={name} onClick={() => { if (!isAlreadyAdded) { addSectionWithName(name); setShowTierDropdown(false); } }} style={{ padding: "10px", cursor: isAlreadyAdded ? "not-allowed" : "pointer", borderRadius: "6px", marginBottom: "5px", color: isAlreadyAdded ? "#ccc" : "#000", border: "1px solid #eee" }}>{name} {isAlreadyAdded && <span style={{ fontSize: "10px" }}>Added</span>}</div>);
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px", marginTop: "10px" }}>
                                {sections.map((s) => (
                                    <div key={s.id} style={{ padding: "15px", borderRadius: "12px", border: "2px solid #e33129", backgroundColor: "#fff5f5", position: "relative" }}>
                                        <button type="button" onClick={() => removeSection(s.id)} style={{ position: "absolute", top: "5px", right: "5px", border: "none", background: "none", color: "#e33129", cursor: "pointer", fontWeight: "bold" }}>×</button>
                                        <label style={{ fontSize: "12px", color: "#666" }}>Section Name</label>
                                        <input type="text" style={{ ...inputStyle, padding: "5px", fontWeight: "700", borderBottom: "1px solid #e33129" }} value={s.name} onChange={(e) => updateSection(s.id, 'name', e.target.value)} />
                                        <label style={{ fontSize: "12px", color: "#666", marginTop: "10px", display: "block" }}>Seat Allocation</label>
                                        <input type="number" style={{ ...inputStyle, padding: "5px", borderBottom: "1px solid #ddd" }} value={s.seats} onChange={(e) => updateSection(s.id, 'seats', e.target.value)} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ width: "100%", marginTop: "30px", boxSizing: "border-box" }}>
                            <label style={labelStyle}>Event Banner Images</label>
                            <input ref={fileInputRef} type="file" style={{ display: "none" }} accept="image/*" multiple onChange={handleImageChange} />
                            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center", marginTop: "15px" }}>
                                {previewUrls.map((url, i) => (
                                    <div key={i} style={{ position: "relative", textAlign: "center" }}>
                                        <img src={url} alt="Preview" style={{ width: "120px", height: "100px", objectFit: "cover", borderRadius: "12px", border: "1px solid #eee", marginBottom: "5px" }} />
                                        <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                                            <button type="button" onClick={() => {
                                                const input = document.createElement('input');
                                                input.type = 'file';
                                                input.onchange = (e) => { if(e.target.files[0]) replaceImage(i, e.target.files[0]); };
                                                input.click();
                                            }} style={actionButtonStyle}>Edit</button>
                                            <button type="button" onClick={() => removeImage(i)} style={{ ...actionButtonStyle, color: "#e33129", backgroundColor: "#fff0f0" }}>Del</button>
                                        </div>
                                    </div>
                                ))}
                                <div onClick={() => fileInputRef.current.click()} style={{ width: "100px", height: "100px", border: "2px dashed #ddd", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "32px", color: "#aaa", backgroundColor: "#fafafa" }}>+</div>
                            </div>
                        </div>
                    </div>

                    <div style={sectionContainerStyle}>
                        <div style={sectionHeadingStyle}>Venue & Location</div>
                        <div style={{ width: "100%", boxSizing: "border-box" }}>
                            <label style={labelStyle}>Venue / Location</label>
                            <input type="text" style={inputStyle} placeholder="e.g. Grand Ballroom, NY" value={venue} onChange={(e) => setVenue(e.target.value)} required />
                        </div>
                    </div>

                    <div style={sectionContainerStyle}>
                        <div style={sectionHeadingStyle}>Timing & Schedule</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", width: "100%", boxSizing: "border-box" }}>
                            <div><label style={labelStyle}>Starts at</label><input type="datetime-local" style={inputStyle} value={startDate} onChange={(e) => setStartDate(e.target.value)} required /></div>
                            <div><label style={labelStyle}>Ends at (Optional)</label><input type="datetime-local" style={inputStyle} value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
                        </div>
                    </div>

                    <div style={sectionContainerStyle}>
                        <div style={sectionHeadingStyle}>Contact Information</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "30px", width: "100%", boxSizing: "border-box" }}>
                            <div><label style={labelStyle}>Contact Email</label><input type="email" style={inputStyle} placeholder="register@example.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} /></div>
                            <div><label style={labelStyle}>Contact Phone</label><input type="tel" style={inputStyle} placeholder="+1 234 567 890" value={contactPhone} onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} /></div>
                        </div>
                    </div>

                    <div style={sectionContainerStyle}>
                        <div style={sectionHeadingStyle}>Event Organizer</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px", width: "100%", boxSizing: "border-box" }}>
                            <div><label style={labelStyle}>Organizer Name</label><input type="text" style={inputStyle} placeholder="Mike Richard" value={organizerName} onChange={(e) => setOrganizerName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))} /></div>
                            <div><label style={labelStyle}>Role / Designation</label><input type="text" style={inputStyle} placeholder="Director" value={organizerRole} onChange={(e) => setOrganizerRole(e.target.value)} /></div>
                            <div><label style={labelStyle}>Company / Group</label><input type="text" style={inputStyle} placeholder="Care NGO" value={organizerCompany} onChange={(e) => setOrganizerCompany(e.target.value)} /></div>
                        </div>
                        <div style={{ width: "100%", marginTop: "20px", boxSizing: "border-box" }}>
                            <label style={labelStyle}>Organizer Profile Image</label>
                            <input ref={organizerInputRef} type="file" style={{ display: "none" }} accept="image/*" onChange={handleOrganizerImageChange} />
                            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginTop: "10px" }}>
                                {organizerPreview ? (
                                    <div style={{ textAlign: "center" }}>
                                        <img src={organizerPreview} alt="Organizer" style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "2px solid #e33129", marginBottom: "10px" }} />
                                        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                                            <button type="button" onClick={() => organizerInputRef.current.click()} style={actionButtonStyle}>Edit</button>
                                            <button type="button" onClick={() => { setOrganizerImageFile(null); setOrganizerPreview(""); }} style={{ ...actionButtonStyle, color: "#e33129", backgroundColor: "#fff0f0" }}>Remove</button>
                                        </div>
                                    </div>
                                ) : (<div onClick={() => organizerInputRef.current.click()} style={{ width: "100px", height: "100px", borderRadius: "50%", border: "2px dashed #ddd", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#999" }}><i className="fas fa-camera"></i></div>)}
                            </div>
                        </div>
                    </div>

                    <div style={sectionContainerStyle}>
                        <div style={sectionHeadingStyle}>Description & Content</div>
                        <div style={{ width: "100%" }}>
                            <div className="rtf-container">
                                <label className="rtf-label">Short Description (Dashboard)</label>
                                <ReactQuill theme="snow" value={description} onChange={(val) => { if(val !== description) setDescription(val); }} modules={quillModules} style={{ backgroundColor: "#fff" }} />
                            </div>
                            <div className="rtf-container">
                                <label className="rtf-label">Detailed Content</label>
                                <ReactQuill theme="snow" value={content} onChange={(val) => { if(val !== content) setContent(val); }} modules={quillModules} style={{ backgroundColor: "#fff" }} />
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-5">
                        <button type="submit" className="btn btn_theme btn_md" style={{ padding: "18px 100px", borderRadius: "50px", fontWeight: "800", boxShadow: "0 15px 35px rgba(227, 49, 41, 0.25)" }} disabled={loading}>
                            {loading ? "Processing..." : (eventData ? "Update Event" : "Publish Event")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAddEvent;
