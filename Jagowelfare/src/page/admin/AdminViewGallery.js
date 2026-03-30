import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { formatDate } from "../../utils/dateFormatter";

const AdminViewGallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchImages = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setImages(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const uniqueTitles = React.useMemo(() => {
        const titles = images.map(img => img.title).filter(Boolean);
        return Array.from(new Set(titles)).sort();
    }, [images]);

    const handleDelete = async (image) => {
        if (window.confirm("Are you sure you want to delete this image?")) {
            try {
                // Delete from database
                const { error: dbError } = await supabase.from('gallery').delete().eq('id', image.id);
                if (dbError) throw dbError;

                // Optional: Delete from storage if it belongs to 'JYF' bucket
                if (image.image_url.includes('JYF')) {
                    const path = image.image_url.split('/JYF/')[1];
                    if (path) {
                        await supabase.storage.from('JYF').remove([path]);
                    }
                }

                setImages(images.filter(img => img.id !== image.id));
                alert("Image deleted successfully!");
            } catch (err) {
                alert("Delete failed: " + err.message);
            }
        }
    };

    const filteredImages = images.filter(img => 
        (img.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center p-5"><h4>Loading Gallery...</h4></div>;

    return (
        <div style={{ backgroundColor: "#f4f6f9", padding: "30px", borderRadius: "15px" }}>
            <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
                    <div>
                        <h3 style={{ margin: 0, fontWeight: "800", color: "#222" }}>Media Gallery Management</h3>
                        <p style={{ color: "#888", fontSize: "14px", marginTop: "5px" }}>View and manage uploaded images</p>
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <select 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ padding: "10px 15px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "14px", minWidth: "250px", backgroundColor: "#f9f9f9" }}
                            >
                                <option value="">Filter by Caption (All)</option>
                                {uniqueTitles.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                            
                            {searchTerm && (
                                <button 
                                    onClick={async () => {
                                        const newTitle = window.prompt("Enter new name for this category:", searchTerm);
                                        if (newTitle && newTitle !== searchTerm) {
                                            if (window.confirm(`Are you sure you want to rename '${searchTerm}' to '${newTitle}'? This will update all ${filteredImages.length} images.`)) {
                                                try {
                                                    setLoading(true);
                                                    const { error } = await supabase
                                                        .from('gallery')
                                                        .update({ title: newTitle })
                                                        .eq('title', searchTerm);
                                                    
                                                    if (error) throw error;
                                                    
                                                    alert("Category renamed successfully!");
                                                    setSearchTerm(newTitle);
                                                    await fetchImages();
                                                } catch (err) {
                                                    alert("Rename failed: " + err.message);
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }
                                        }
                                    }}
                                    style={{ 
                                        backgroundColor: "#e33129", 
                                        color: "white", 
                                        border: "none", 
                                        padding: "10px 15px", 
                                        borderRadius: "10px", 
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "5px"
                                    }}
                                    title="Rename Category"
                                >
                                    <i className="fas fa-edit"></i> Edit Name
                                </button>
                            )}
                        </div>
                        <span className="badge" style={{ backgroundColor: "#e3312915", color: "#e33129", padding: "10px 20px", borderRadius: "30px", fontWeight: "700" }}>
                            {filteredImages.length} Images
                        </span>
                    </div>
                </div>

                <div className="row" style={{ display: "flex", flexWrap: "wrap", margin: "0 -15px" }}>
                    {filteredImages.map((img) => (
                        <div key={img.id} style={{ flex: "0 0 33.333%", maxWidth: "33.333%", padding: "0 15px", marginBottom: "30px" }}>
                            <div style={{ backgroundColor: "#fcfcfc", borderRadius: "15px", overflow: "hidden", border: "1px solid #eee", transition: "transform 0.2s", position: "relative" }}>
                                <div style={{ height: "150px", overflow: "hidden", position: "relative", cursor: "pointer" }} onClick={() => window.open(img.image_url, '_blank')}>
                                    <img 
                                        src={img.image_url} 
                                        alt={img.title} 
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                    />
                                    <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "5px" }} onClick={(e) => e.stopPropagation()}>
                                        <button 
                                            onClick={() => handleDelete(img)}
                                            style={{ backgroundColor: "#e33129", color: "white", border: "none", width: "30px", height: "30px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(227, 49, 41, 0.3)" }}
                                            title="Delete"
                                        >
                                            <i className="fas fa-trash-alt" style={{ fontSize: "12px" }}></i>
                                        </button>
                                    </div>
                                </div>
                                <div style={{ padding: "15px" }}>
                                    <h5 style={{ fontSize: "13px", fontWeight: "700", margin: 0, color: "#222", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                                        {img.title || "Untitled Image"}
                                    </h5>
                                    <p style={{ fontSize: "10px", color: "#999", marginTop: "5px", margin: 0 }}>
                                        Added: {formatDate(img.created_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredImages.length === 0 && (
                        <div className="col-12 text-center p-5" style={{ width: "100%" }}>
                            <i className="fas fa-images mb-3" style={{ fontSize: "48px", color: "#ddd" }}></i>
                            <h4 style={{ color: "#888" }}>No images found in gallery</h4>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminViewGallery;
