import React, { useState, useEffect, useRef } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from "../../supabase";

const AdminDashboardUpdates = () => {
    const [loading, setLoading] = useState(false);
    
    // Refs for file inputs
    const heroInputRef = useRef(null);
    const introInputRef = useRef(null);
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
        para1: "At Jain Youth Foundation (JYF), our volunteers are inspired by Jain values of Ahimsa (non-violence), compassion, service, and unity. While the foundation is run by members of the Jain community, our initiatives are dedicated to the welfare of society at large, helping people across communities.",
        para2: "Through our various initiatives, we focus on healthcare, food support, education, and humanitarian services, impacting thousands of lives every year.",
        image_url: "",
    });

    // Page Banners State
    const [pageBanners, setPageBanners] = useState({
        events: { heading: "Events", image_url: "" },
        causes: { heading: "Causes", image_url: "" },
        news: { heading: "News Articles", image_url: "" },
        gallery: { heading: "Gallery", image_url: "" },
        about: { heading: "About Us", image_url: "" },
        contact: { heading: "Contact Us", image_url: "" },
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
                            <label style={{ margin: 0 }}>Hero Image <span style={{ color: "#888", fontWeight: "normal", fontSize: "12px" }}>(Suggested size: 619 x 684)</span></label>
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
                        <label>Main Title</label>
                        <input type="text" style={inputStyle} value={homeIntro.title} onChange={(e) => setHomeIntro({...homeIntro, title: e.target.value})} />
                        <label>Paragraph 1</label>
                        <div className="rtf-box">
                            <ReactQuill theme="snow" value={homeIntro.para1 || ""} onChange={(val) => {
                                if (val !== homeIntro.para1) {
                                    setHomeIntro({...homeIntro, para1: val});
                                }
                            }} modules={quillModules} />
                        </div>
                        <label>Paragraph 2</label>
                        <div className="rtf-box">
                            <ReactQuill theme="snow" value={homeIntro.para2 || ""} onChange={(val) => {
                                if (val !== homeIntro.para2) {
                                    setHomeIntro({...homeIntro, para2: val});
                                }
                            }} modules={quillModules} />
                        </div>
                    </div>
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                            <label style={{ margin: 0 }}>Intro Image</label>
                            {homeIntro.image_url && (
                                <div>
                                    <button onClick={() => introInputRef.current.click()} style={{ ...actionButtonStyle, backgroundColor: "#eee" }}>Edit</button>
                                    <button onClick={() => setHomeIntro({...homeIntro, image_url: ""})} style={{ ...actionButtonStyle, backgroundColor: "#ffefef", color: "#ca1e14" }}>Delete</button>
                                </div>
                            )}
                        </div>
                        <input 
                            ref={introInputRef}
                            type="file" 
                            style={homeIntro.image_url ? { display: "none" } : inputStyle} 
                            onChange={async (e) => {
                            if (e.target.files[0]) {
                                const url = await handleImageUpload(e.target.files[0], "home_intro");
                                setHomeIntro({...homeIntro, image_url: url});
                            }
                        }} />
                        {homeIntro.image_url && <img src={homeIntro.image_url} alt="preview" style={{ width: "100%", borderRadius: "10px", border: "1px solid #eee" }} />}
                    </div>
                </div>
                <button onClick={() => handleSave('home_intro', homeIntro)} className="btn btn_theme mt-3" disabled={loading}>
                    Save Home Intro Changes
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
                                <label style={{ margin: 0 }}>Banner Image</label>
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
        </div>
    );
};

export default AdminDashboardUpdates;
