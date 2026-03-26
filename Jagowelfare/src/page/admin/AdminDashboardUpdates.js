import React, { useState, useEffect, useRef } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from "../../supabase";

const AdminDashboardUpdates = () => {
    const [loading, setLoading] = useState(false);
    
    // Refs for file inputs
    const heroInputRef = useRef(null);
    const introInputRef1 = useRef(null);
    const introInputRef2 = useRef(null);
    const bannerInputRefs = useRef({});

    // Home Hero State
    const [homeHero, setHomeHero] = useState({
        title: "Unity in commUNITY",
        description: "Jain Youth Foundation is dedicated to empowering lives through service and welfare. Join us in making a difference.",
        image_url: "",
    });

    // Home Intro State (About Area)
    const [homeIntro, setHomeIntro] = useState({
        heading: "Welcome to JYF",
        title: "Serving Humanity Through Compassion",
        para1: "We are the largest crowdfunding",
        para2: "At Jain Youth Foundation (JYF), our volunteers are inspired by Jain values of Ahimsa (non-violence), compassion, service, and unity.",
        para3: "Through our various initiatives, we focus on healthcare, food support, education, and humanitarian services, impacting thousands of lives every year.",
        image_url: "",
        image_url_2: "",
    });

    // Page Banners State
    const [pageBanners, setPageBanners] = useState({
        events: { heading: "Events", image_url: "" },
        causes: { heading: "Causes", image_url: "" },
        news: { heading: "News Articles", image_url: "" },
        about: { heading: "About Us", image_url: "" },
        gallery: { heading: "Gallery", image_url: "" },
        contact: { heading: "Contact Us", image_url: "" },
        team: { heading: "Volunteering Team", image_url: "" },
        testimonials: { heading: "Supporter Feedback", image_url: "" },
    });

    // Site Contact State
    const [siteContact, setSiteContact] = useState({
        phones: ["70 45 70 75 00", "", ""],
        emails: ["info@jainyouth.in", "", ""],
        address: "21/B, Shanti Bhuvan Shopping Centre, 2nd Floor, JD Road, Above 396 Bus Stop, Mulund (W), Mumbai-80."
    });

    const quillModules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['clean']
        ],
    };

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            const { data, error } = await supabase.from('site_config').select('*');
            if (error) {
                console.error("Error fetching configs:", error);
                return;
            }
            
            data.forEach(item => {
                if (item.key === 'home_hero') setHomeHero(item.value);
                if (item.key === 'home_intro') setHomeIntro(item.value);
                if (item.key === 'page_banners') setPageBanners(item.value);
                if (item.key === 'site_contact') setSiteContact(item.value);
            });
        } catch (e) {
            console.error(e);
        }
    };

    const handleSave = async (key, value) => {
        setLoading(true);
        try {
            const { error } = await supabase.from('site_config').upsert({ key, value }, { onConflict: 'key' });
            if (error) throw error;
            alert(`${key.replace("_", " ")} updated successfully!`);
        } catch (e) {
            console.error(e);
            alert(`Error: ${e.message}`);
        }
        setLoading(false);
    };

    const handleImageUpload = async (file, path) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${path.replace("/", "_")}.${fileExt}`;
        const filePath = `banners/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('JYF').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('JYF').getPublicUrl(filePath);
        return publicUrl;
    };

    const inputStyle = {
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        width: "100%",
        marginBottom: "15px",
    };

    const actionButtonStyle = {
        padding: "6px 12px",
        fontSize: "13px",
        borderRadius: "5px",
        cursor: "pointer",
        marginRight: "8px",
        border: "none",
        fontWeight: "600",
        transition: "all 0.3s"
    };

    const sectionStyle = {
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "15px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        marginBottom: "30px",
    };

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <style>
                {`
                    .ql-container { min-height: 80px; font-size: 16px; font-family: inherit; }
                    .ql-editor { min-height: 80px; }
                    .rtf-box { margin-bottom: 20px; background: #fff; }
                `}
            </style>
            <h2 style={{ marginBottom: "30px", fontWeight: "800" }}>Dashboard Updates & Global Banners</h2>

            {/* Home Hero Section */}
            <div style={sectionStyle}>
                <h4 style={{ marginBottom: "20px", color: "#ca1e14", fontWeight: "700" }}>Main Home Hero Update</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div>
                        <label>Hero Title</label>
                        <input 
                            type="text" 
                            style={inputStyle} 
                            value={homeHero.title} 
                            onChange={(e) => setHomeHero({...homeHero, title: e.target.value})} 
                        />
                        <label>Description</label>
                        <div className="rtf-box">
                            <ReactQuill 
                                theme="snow" 
                                value={homeHero.description} 
                                onChange={(val) => {
                                    if (val !== homeHero.description) {
                                        setHomeHero({...homeHero, description: val});
                                    }
                                }} 
                                modules={quillModules}
                            />
                        </div>
                    </div>
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                            <label style={{ margin: 0 }}>Hero Image <span style={{ color: "#ca1e14", fontWeight: "600", fontSize: "12px" }}>(Suggested size: 619 x 684 px)</span></label>
                            {homeHero.image_url && (
                                <div>
                                    <button onClick={() => heroInputRef.current.click()} style={{ ...actionButtonStyle, backgroundColor: "#eee" }}>Edit</button>
                                    <button onClick={() => setHomeHero({...homeHero, image_url: ""})} style={{ ...actionButtonStyle, backgroundColor: "#ffefef", color: "#ca1e14" }}>Delete</button>
                                </div>
                            )}
                        </div>
                        <input 
                            ref={heroInputRef}
                            type="file" 
                            style={homeHero.image_url ? { display: "none" } : inputStyle} 
                            onChange={async (e) => {
                                if (e.target.files[0]) {
                                    const url = await handleImageUpload(e.target.files[0], "home_hero");
                                    setHomeHero({...homeHero, image_url: url});
                                }
                            }} 
                        />
                        {homeHero.image_url && <img src={homeHero.image_url} alt="preview" style={{ width: "100%", borderRadius: "10px", border: "1px solid #eee" }} />}
                    </div>
                </div>
                <button onClick={() => handleSave('home_hero', homeHero)} className="btn btn_theme mt-3" disabled={loading}>
                    Save Home Hero Changes
                </button>
            </div>

            {/* Home Intro Section */}
            <div style={sectionStyle}>
                <h4 style={{ marginBottom: "20px", color: "#ca1e14", fontWeight: "700" }}>Home Introduction (About Section)</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div>
                        <label>Small Heading</label>
                        <input type="text" style={inputStyle} value={homeIntro.heading} onChange={(e) => setHomeIntro({...homeIntro, heading: e.target.value})} />
                        <label>Main Title (Keywords JYF, Humanity, and Compassion are automatically highlighted)</label>
                        <input type="text" style={inputStyle} value={homeIntro.title} onChange={(e) => setHomeIntro({...homeIntro, title: e.target.value})} />
                        <label>Sub-Heading (Red Text)</label>
                        <input type="text" style={inputStyle} value={homeIntro.para1} onChange={(e) => setHomeIntro({...homeIntro, para1: e.target.value})} />
                        
                        <label>Main Description Block 1</label>
                        <div className="rtf-box">
                            <ReactQuill theme="snow" value={homeIntro.para2 || ""} onChange={(val) => {
                                if (val !== homeIntro.para2) {
                                    setHomeIntro({...homeIntro, para2: val});
                                }
                            }} modules={quillModules} />
                        </div>

                        <label>Main Description Block 2</label>
                        <div className="rtf-box">
                            <ReactQuill theme="snow" value={homeIntro.para3 || ""} onChange={(val) => {
                                if (val !== homeIntro.para3) {
                                    setHomeIntro({...homeIntro, para3: val});
                                }
                            }} modules={quillModules} />
                        </div>
                    </div>
                    <div>
                        {/* Image 1: Main (Lower) */}
                        <div style={{ marginBottom: "25px", border: "1px dashed #ddd", padding: "15px", borderRadius: "10px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                <label style={{ margin: 0, fontWeight: "700" }}>Main Background Image (Lower) <br/><span style={{ color: "#ca1e14", fontWeight: "600", fontSize: "11px" }}>(Suggested size: 570 x 630 px)</span></label>
                                {homeIntro.image_url ? (
                                    <div>
                                        <button onClick={() => introInputRef1.current.click()} style={{ ...actionButtonStyle, backgroundColor: "#eee" }}>Edit</button>
                                        <button onClick={() => setHomeIntro({...homeIntro, image_url: ""})} style={{ ...actionButtonStyle, backgroundColor: "#ffefef", color: "#ca1e14" }}>Delete</button>
                                    </div>
                                ) : (
                                    <button onClick={() => introInputRef1.current.click()} style={{ ...actionButtonStyle, backgroundColor: "#ca1e14", color: "#fff" }}>Add Image</button>
                                )}
                            </div>
                            <input 
                                ref={introInputRef1}
                                type="file" 
                                style={{
                                    opacity: 0,
                                    position: "absolute",
                                    width: 0,
                                    height: 0,
                                    pointerEvents: "none"
                                }} 
                                onChange={async (e) => {
                                    if (e.target.files[0]) {
                                        try {
                                            const url = await handleImageUpload(e.target.files[0], "home_intro_main");
                                            setHomeIntro({...homeIntro, image_url: url});
                                            alert("Main image updated successfully!");
                                        } catch (err) {
                                            alert("Upload failed: " + err.message);
                                        }
                                        e.target.value = null; // Reset for future edits
                                    }
                                }} 
                            />
                            {homeIntro.image_url && <img src={homeIntro.image_url} alt="preview" style={{ width: "100%", borderRadius: "8px" }} />}
                        </div>

                        {/* Image 2: Floating (Upper) */}
                        <div style={{ border: "1px dashed #ddd", padding: "15px", borderRadius: "10px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                <label style={{ margin: 0, fontWeight: "700" }}>Floating Overlay Image (Upper) <br/><span style={{ color: "#ca1e14", fontWeight: "600", fontSize: "11px" }}>(Suggested size: 320 x 300 px)</span></label>
                                {homeIntro.image_url_2 ? (
                                    <div>
                                        <button onClick={() => introInputRef2.current.click()} style={{ ...actionButtonStyle, backgroundColor: "#eee" }}>Edit</button>
                                        <button onClick={() => setHomeIntro({...homeIntro, image_url_2: ""})} style={{ ...actionButtonStyle, backgroundColor: "#ffefef", color: "#ca1e14" }}>Delete</button>
                                    </div>
                                ) : (
                                    <button onClick={() => introInputRef2.current.click()} style={{ ...actionButtonStyle, backgroundColor: "#ca1e14", color: "#fff" }}>Add Image</button>
                                )}
                            </div>
                            <input 
                                ref={introInputRef2}
                                type="file" 
                                style={{
                                    opacity: 0,
                                    position: "absolute",
                                    width: 0,
                                    height: 0,
                                    pointerEvents: "none"
                                }}
                                onChange={async (e) => {
                                    if (e.target.files[0]) {
                                        try {
                                            const url = await handleImageUpload(e.target.files[0], "home_intro_floating");
                                            setHomeIntro({...homeIntro, image_url_2: url});
                                            alert("Floating image updated successfully!");
                                        } catch (err) {
                                            alert("Upload failed: " + err.message);
                                        }
                                        e.target.value = null; // Reset for future edits
                                    }
                                }} 
                            />
                            {homeIntro.image_url_2 && <img src={homeIntro.image_url_2} alt="preview" style={{ width: "50%", borderRadius: "8px" }} />}
                        </div>
                    </div>
                </div>
                <button onClick={() => handleSave('home_intro', homeIntro)} className="btn btn_theme mt-3" disabled={loading} style={{ width: "100%", padding: "12px" }}>
                    Save Home Intro (About) Changes
                </button>
            </div>

            {/* Page Banners Section */}
            <div style={sectionStyle}>
                <h4 style={{ marginBottom: "20px", color: "#ca1e14", fontWeight: "700" }}>Global Page Banners (Subsections)</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
                    {Object.keys(pageBanners).map(key => (
                        <div key={key} style={{ padding: "15px", border: "1px solid #eee", borderRadius: "10px" }}>
                            <h5 style={{ textTransform: "uppercase", fontSize: "14px", fontWeight: "800", marginBottom: "15px" }}>{key} Page Banner</h5>
                            <label>Banner Heading</label>
                            <input 
                                type="text" 
                                style={inputStyle} 
                                value={pageBanners[key].heading} 
                                onChange={(e) => {
                                    const newBanners = {...pageBanners};
                                    newBanners[key].heading = e.target.value;
                                    setPageBanners(newBanners);
                                }} 
                            />
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                <label style={{ margin: 0, fontWeight: "700" }}>Banner Image <span style={{ color: "#ca1e14", fontSize: "11px" }}>(Suggested: 1920 x 450 px)</span></label>
                                {pageBanners[key].image_url && (
                                    <div>
                                        <button onClick={() => bannerInputRefs.current[key].click()} style={{ ...actionButtonStyle, backgroundColor: "#eee" }}>Edit</button>
                                        <button onClick={() => {
                                            const newBanners = {...pageBanners};
                                            newBanners[key].image_url = "";
                                            setPageBanners(newBanners);
                                        }} style={{ ...actionButtonStyle, backgroundColor: "#ffefef", color: "#ca1e14" }}>Delete</button>
                                    </div>
                                )}
                            </div>
                            <input 
                                ref={el => bannerInputRefs.current[key] = el}
                                type="file" 
                                style={pageBanners[key].image_url ? { display: "none" } : inputStyle} 
                                onChange={async (e) => {
                                    if (e.target.files[0]) {
                                        const url = await handleImageUpload(e.target.files[0], key);
                                        const newBanners = {...pageBanners};
                                        newBanners[key].image_url = url;
                                        setPageBanners(newBanners);
                                    }
                                }} 
                            />
                            {pageBanners[key].image_url && <img src={pageBanners[key].image_url} alt="preview" style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "5px" }} />}
                        </div>
                    ))}
                </div>
                <button 
                  onClick={() => handleSave('page_banners', pageBanners)} 
                  className="btn btn_theme mt-4" 
                  disabled={loading}
                  style={{ width: "100%", padding: "15px" }}
                >
                    Update All Page Banners
                </button>
            </div>

            {/* Site Contact Section */}
            <div style={sectionStyle}>
                <h4 style={{ marginBottom: "20px", color: "#ca1e14", fontWeight: "700" }}>Global Contact Details (Footer & Header)</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
                    <div>
                        <label style={{ fontWeight: "700", marginBottom: "10px", display: "block" }}>Phone Numbers (Max 3)</label>
                        {[0, 1, 2].map(idx => (
                            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                                <span style={{ color: "#888", width: "20px" }}>{idx + 1}.</span>
                                <input 
                                    type="text" 
                                    style={{ ...inputStyle, marginBottom: 0 }} 
                                    placeholder={`Phone Number ${idx + 1}`}
                                    value={siteContact.phones?.[idx] || ""} 
                                    onChange={(e) => {
                                        const newPhones = [...(siteContact.phones || ["", "", ""])];
                                        newPhones[idx] = e.target.value;
                                        setSiteContact({...siteContact, phones: newPhones});
                                    }} 
                                />
                            </div>
                        ))}

                        <label style={{ fontWeight: "700", marginTop: "20px", marginBottom: "10px", display: "block" }}>Email Addresses (Max 3)</label>
                        {[0, 1, 2].map(idx => (
                            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                                <span style={{ color: "#888", width: "20px" }}>{idx + 1}.</span>
                                <input 
                                    type="text" 
                                    style={{ ...inputStyle, marginBottom: 0 }} 
                                    placeholder={`Email Address ${idx + 1}`}
                                    value={siteContact.emails?.[idx] || ""} 
                                    onChange={(e) => {
                                        const newEmails = [...(siteContact.emails || ["", "", ""])];
                                        newEmails[idx] = e.target.value;
                                        setSiteContact({...siteContact, emails: newEmails});
                                    }} 
                                />
                            </div>
                        ))}
                    </div>
                    <div>
                        <label style={{ fontWeight: "700", marginBottom: "10px", display: "block" }}>Physical Address</label>
                        <textarea 
                            style={{ ...inputStyle, height: "130px", resize: "none" }} 
                            value={siteContact.address} 
                            placeholder="Enter full organization address..."
                            onChange={(e) => setSiteContact({...siteContact, address: e.target.value})}
                        />
                        <div style={{ marginTop: "20px", padding: "15px", background: "#f9f9f9", borderRadius: "10px", fontSize: "13px", color: "#666" }}>
                            <i className="fas fa-info-circle" style={{ marginRight: "8px", color: "#ca1e14" }}></i>
                            These details are used in the Header topbar, Footer contact section, and the main Contact Us page.
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => handleSave('site_contact', siteContact)} 
                    className="btn btn_theme mt-4" 
                    disabled={loading}
                    style={{ width: "100%", padding: "15px", fontWeight: "700" }}
                >
                    Save All Contact Details
                </button>
            </div>
        </div>
    );
};

export default AdminDashboardUpdates;
