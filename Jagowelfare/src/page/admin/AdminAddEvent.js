import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";

const AdminAddEvent = ({ onPublish }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
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
        console.log("Submit clicked. Title:", title);
        setLoading(true);

        // Safety timeout - if it takes more than 15 seconds, something is wrong
        const timeout = setTimeout(() => {
            if (loading) {
                setLoading(false);
                alert("Upload taking too long. Please check your internet connection or firestore/storage rules.");
            }
        }, 15000);

        try {
            let imageUrl = "";
            if (imageFile) {
                console.log("Step 1: Uploading image...");
                const imageRef = ref(storage, `events/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(imageRef, imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
                console.log("Step 1 Complete: URL is", imageUrl);
            }

            console.log("Step 2: Saving to Firestore...");
            await addDoc(collection(db, "events"), {
                title: title.trim(),
                description: description.trim(),
                location: location.trim(),
                imageUrl,
                startAt: date ? new Date(date) : serverTimestamp(),
                status: "published",
                createdAt: serverTimestamp()
            });
            console.log("Step 2 Complete: Saved!");

            clearTimeout(timeout);
            alert("Success! The event is now live.");
            if (onPublish) onPublish();
        } catch (error) {
            clearTimeout(timeout);
            console.error("CRITICAL ERROR during publishing:", error);
            alert("Publication ERR: " + error.code + " - " + error.message);
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
            <h3 style={{ marginBottom: "40px", fontWeight: "800", color: "#222", fontSize: "26px", textAlign: "center" }}>Event Registration</h3>
            
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-lg-12 mb-5">
                        <label style={labelStyle}>Event Title</label>
                        <input 
                            type="text" 
                            style={inputStyle}
                            placeholder="e.g. Annual Charity Gala" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            onFocus={(e) => e.target.style.borderBottomColor = "#e33129"}
                            onBlur={(e) => e.target.style.borderBottomColor = "#ddd"}
                            required 
                        />
                    </div>

                    <div className="col-lg-12 mb-5">
                        <label style={labelStyle}>Event Banner Image</label>
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

                    <div className="col-lg-6 mb-5">
                        <label style={labelStyle}>Date & Time</label>
                        <input 
                            type="datetime-local" 
                            style={inputStyle}
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                            onFocus={(e) => e.target.style.borderBottomColor = "#e33129"}
                            onBlur={(e) => e.target.style.borderBottomColor = "#ddd"}
                            required 
                        />
                    </div>

                    <div className="col-lg-6 mb-5">
                        <label style={labelStyle}>Location</label>
                        <input 
                            type="text" 
                            style={inputStyle}
                            placeholder="e.g. Grand Ballroom, NY" 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)} 
                            onFocus={(e) => e.target.style.borderBottomColor = "#e33129"}
                            onBlur={(e) => e.target.style.borderBottomColor = "#ddd"}
                            required 
                        />
                    </div>

                    <div className="col-lg-12 mb-5">
                        <label style={labelStyle}>Event Description</label>
                        <textarea 
                            style={{ ...inputStyle, minHeight: "100px" }}
                            placeholder="What is this event about? Mention key highlights..." 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
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
