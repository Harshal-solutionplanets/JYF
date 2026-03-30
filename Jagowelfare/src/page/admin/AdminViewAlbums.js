import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";

const AdminViewAlbums = () => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [draggedIndex, setDraggedIndex] = useState(null);

    const fetchAlbums = async () => {
        setLoading(true);
        try {
            // 1. Get unique titles from gallery table
            const { data: galleryData, error: galleryError } = await supabase.from('gallery').select('title');
            if (galleryError) throw galleryError;
            const uniqueTitles = Array.from(new Set(galleryData.map(item => item.title).filter(Boolean)));

            // 2. Try fetching from gallery_categories
            let { data: catData, error: catError } = await supabase
                .from('gallery_categories')
                .select('*')
                .order('priority', { ascending: false });

            // If table missing or error, use uniqueTitles directly
            if (catError || !catData || catData.length === 0) {
                console.log("Using fallback: Unique titles from gallery images");
                setAlbums(uniqueTitles.map((t, i) => ({ id: i, name: t, priority: 0 })));
                setLoading(false);
                return;
            }

            // 3. Sync missing titles if table exists
            const existingNames = (catData || []).map(c => c.name);
            const missingTitles = uniqueTitles.filter(t => !existingNames.includes(t));

            if (missingTitles.length > 0) {
                const inserts = missingTitles.map(t => ({ name: t, priority: 0 }));
                await supabase.from('gallery_categories').insert(inserts);
                
                // Refetch to get IDs
                const { data: refreshedData } = await supabase
                    .from('gallery_categories')
                    .select('*')
                    .order('priority', { ascending: false });
                catData = refreshedData;
            }

            setAlbums(catData || []);
        } catch (err) {
            console.error("Fetch Albums error:", err);
            // Last resort fallback
            setAlbums([]); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlbums();
    }, []);

    const onDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const onDragOver = (e, index) => {
        e.preventDefault();
    };

    const onDrop = async (e, index) => {
        e.preventDefault();
        if (draggedIndex === index) return;

        const newAlbums = [...albums];
        const itemToMove = newAlbums.splice(draggedIndex, 1)[0];
        newAlbums.splice(index, 0, itemToMove);
        setAlbums(newAlbums);

        // Update priority in DB
        const updates = newAlbums.map((a, i) => ({
            id: a.id,
            priority: newAlbums.length - i
        }));

        try {
            for (const update of updates) {
                await supabase.from('gallery_categories').update({ priority: update.priority }).eq('id', update.id);
            }
        } catch (err) {
            console.error("Order update failed", err);
        }
        setDraggedIndex(null);
    };

    const handleMove = async (index, direction) => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= albums.length) return;

        const newAlbums = [...albums];
        const temp = newAlbums[index];
        newAlbums[index] = newAlbums[newIndex];
        newAlbums[newIndex] = temp;
        setAlbums(newAlbums);

        // Update priority in DB
        const updates = newAlbums.map((a, i) => ({
            id: a.id,
            priority: newAlbums.length - i
        }));

        try {
            for (const update of updates) {
                await supabase.from('gallery_categories').update({ priority: update.priority }).eq('id', update.id);
            }
        } catch (err) {
            console.error("Order update failed", err);
        }
    };

    const handleDeleteAlbum = async (album) => {
        if (window.confirm(`Are you sure you want to delete the album "${album.name}"? This will not delete the images, only the album entry for reordering.`)) {
            try {
                const { error } = await supabase.from('gallery_categories').delete().eq('id', album.id);
                if (error) throw error;
                setAlbums(albums.filter(a => a.id !== album.id));
                alert("Album removed successfully!");
            } catch (err) {
                alert("Failed to delete album: " + err.message);
            }
        }
    };

    if (loading) return <div className="text-center p-5"><h4>Loading Albums...</h4></div>;

    return (
        <div style={{ backgroundColor: "#f4f6f9", padding: "30px", borderRadius: "15px" }}>
            <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <div>
                        <h3 style={{ margin: 0, fontWeight: "800", color: "#222" }}>Manage Album Order</h3>
                        <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#e33129", fontWeight: "600" }}>
                            <i className="fas fa-info-circle mr-2"></i> Use the grip icon to drag or the buttons to reorder albums.
                        </p>
                    </div>
                    <span className="badge" style={{ backgroundColor: "#e3312915", color: "#e33129", padding: "10px 20px", borderRadius: "30px", fontWeight: "700" }}>
                        {albums.length} Albums
                    </span>
                </div>

                <div className="table-responsive">
                    <table className="table" style={{ borderCollapse: "separate", borderSpacing: "0 10px", marginTop: "-10px" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#fdfdfd" }}>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px", width: "80px", textAlign: "center" }}>Grip</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Album Name (Category)</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px", textAlign: "center" }}>Move</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px", textAlign: "center" }}>Priority</th>
                            </tr>
                        </thead>
                        <tbody>
                            {albums.map((album, index) => (
                                <tr 
                                    key={album.id} 
                                    draggable
                                    onDragStart={(e) => onDragStart(e, index)}
                                    onDragOver={(e) => onDragOver(e, index)}
                                    onDrop={(e) => onDrop(e, index)}
                                    style={{ 
                                        backgroundColor: "#fcfcfc", 
                                        boxShadow: "0 5px 15px rgba(0,0,0,0.01)", 
                                        borderRadius: "15px", 
                                        verticalAlign: "middle",
                                        cursor: "grab",
                                        opacity: draggedIndex === index ? 0.5 : 1,
                                        transition: "0.2s"
                                    }}
                                >
                                    <td style={{ border: "none", padding: "20px", borderTopLeftRadius: "15px", borderBottomLeftRadius: "15px", textAlign: "center", color: "#e33129" }}>
                                        <i className="fas fa-grip-vertical" style={{ fontSize: "18px" }}></i>
                                    </td>
                                    <td style={{ border: "none", padding: "20px" }}>
                                        <div style={{ fontWeight: "700", color: "#333", fontSize: "16px" }}>{album.name}</div>
                                    </td>
                                    <td style={{ border: "none", padding: "20px", textAlign: "center" }}>
                                        <div style={{ display: "flex", gap: "8px", justifyContent: "center", alignItems: "center" }}>
                                            <button 
                                                disabled={index === 0}
                                                onClick={(e) => { e.stopPropagation(); handleMove(index, 'up'); }}
                                                style={{ padding: "5px 12px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: index === 0 ? "#f9f9f9" : "#fff", cursor: index === 0 ? "not-allowed" : "pointer" }}
                                                title="Move Up"
                                            >
                                                <i className="fas fa-chevron-up" style={{ color: index === 0 ? "#ccc" : "#e33129" }}></i>
                                            </button>
                                            <button 
                                                disabled={index === albums.length - 1}
                                                onClick={(e) => { e.stopPropagation(); handleMove(index, 'down'); }}
                                                style={{ padding: "5px 12px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: index === albums.length - 1 ? "#f9f9f9" : "#fff", cursor: index === albums.length - 1 ? "not-allowed" : "pointer" }}
                                                title="Move Down"
                                            >
                                                <i className="fas fa-chevron-down" style={{ color: index === albums.length - 1 ? "#ccc" : "#e33129" }}></i>
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDeleteAlbum(album); }}
                                                style={{ padding: "5px 12px", borderRadius: "8px", border: "1px solid #fee2e2", backgroundColor: "#fff5f5", cursor: "pointer", marginLeft: "10px" }}
                                                title="Delete Album Entry"
                                            >
                                                <i className="fas fa-trash-alt" style={{ color: "#ef4444" }}></i>
                                            </button>
                                        </div>
                                    </td>
                                    <td style={{ border: "none", padding: "20px", borderTopRightRadius: "15px", borderBottomRightRadius: "15px", textAlign: "center" }}>
                                        <span style={{ backgroundColor: "#eee", padding: "5px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", color: "#666" }}>
                                            Order: {index + 1}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {albums.length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ padding: "50px", textAlign: "center", color: "#999" }}>
                                        <i className="fas fa-folder-open mb-3" style={{ fontSize: "40px" }}></i>
                                        <p>No albums found. Please upload images first.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div style={{ marginTop: "30px", padding: "15px", backgroundColor: "#fff8f8", borderRadius: "10px", border: "1px solid #ffecec" }}>
                    <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
                        <strong>Note:</strong> Album names are derived from the 'Caption' you provide while uploading images. Use the 'Rename Category' feature in 'View All Images' if you want to change an album's name.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminViewAlbums;
