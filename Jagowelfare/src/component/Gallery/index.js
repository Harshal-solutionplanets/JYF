import React from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabase'
import Icon from "../../assets/img/icon/arrow-round.png"


const GalleryArea = () => {
  const [galleryItems, setGalleryItems] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch gallery items
        const { data: galleryData, error: galleryError } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        if (galleryError) throw galleryError;
        setGalleryItems(galleryData || []);

        // 2. Fetch ordered categories
        const { data: catData, error: catError } = await supabase
          .from('gallery_categories')
          .select('*')
          .order('priority', { ascending: false });
        
        if (!catError) {
          setCategories(catData.map(c => c.name));
        }
      } catch (e) {
        console.error("Failed to load gallery data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const uniqueTitles = React.useMemo(() => {
    // If categories exist from the categories table, use that order
    if (categories.length > 0) {
      const titlesInGallery = new Set(galleryItems.map(item => item.title).filter(Boolean));
      // Only keep categories that actually have images
      return categories.filter(cat => titlesInGallery.has(cat));
    }
    
    // Fallback: simple sorting
    const titles = galleryItems.map(item => item.title).filter(Boolean);
    return Array.from(new Set(titles)).sort();
  }, [galleryItems, categories]);

  const filteredItems = galleryItems.filter(item => 
    !searchTerm || (item.title && item.title.toLowerCase() === searchTerm.toLowerCase())
  );

  const [selectedImage, setSelectedImage] = React.useState(null);

  const handleNext = (e) => {
    e.stopPropagation();
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
    if (currentIndex < filteredItems.length - 1) {
      setSelectedImage(filteredItems[currentIndex + 1]);
    }
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
    if (currentIndex > 0) {
      setSelectedImage(filteredItems[currentIndex - 1]);
    }
  };

  return (
    <>
      <section id="gallery_grid_area" className="section_padding">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
                    <div className="section_heading text-center">
                        <h3 style={{ color: "#e33129", fontWeight: "700" }}>Gallery</h3>
                        <h2> Explore our <span className="color_big_heading">gallery</span> to know how we works</h2>
                    </div>
                </div>
            </div>

            {/* Filter Dropdown */}
            {!loading && galleryItems.length > 0 && (
                <div className="row mb-5 justify-content-center">
                    <div className="col-lg-4 text-center">
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ fontWeight: "700", color: "#222", fontSize: "14px", display: "block", marginBottom: "8px", textTransform: "uppercase" }}>Filter by Collection</label>
                            <select 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ 
                                    width: "100%", 
                                    padding: "12px 20px", 
                                    borderRadius: "30px", 
                                    border: "2px solid #eee", 
                                    fontSize: "15px", 
                                    fontWeight: "600",
                                    color: "#444",
                                    outline: "none",
                                    boxShadow: "0 5px 15px rgba(0,0,0,0.03)",
                                    appearance: "none",
                                    backgroundColor: "#fff",
                                    backgroundImage: "url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%27292.4%27%20height%3D%27292.4%27%3E%3Cpath%20fill%3D%27%23e33129%27%20d%3D%27M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%27/%3E%3C/svg%3E\")",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "right 20px top 50%",
                                    backgroundSize: "12px auto"
                                }}
                            >
                                <option value="">Show All Photos</option>
                                {uniqueTitles.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        {searchTerm && (
                            <p style={{ fontSize: "13px", color: "#888", fontWeight: "500" }}>Showing {filteredItems.length} photos from "{searchTerm}"</p>
                        )}
                    </div>
                </div>
            )}

    <div className="row popup-gallery">
        {loading ? (
            <div className="col-12 text-center p-5" style={{ minHeight: "400px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <div className="spinner-border text-danger" style={{ width: "3rem", height: "3rem" }} role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-4" style={{ fontWeight: "600", color: "#666", letterSpacing: "1px" }}>SYNCING LATEST MEDIA...</p>
            </div>
        ) : filteredItems.length === 0 ? (
            <div className="col-12 text-center p-5">
                <i className="fas fa-images mb-3" style={{ fontSize: "48px", color: "#ddd" }}></i>
                <p>No images found in this collection.</p>
                <button onClick={() => setSearchTerm("")} className="btn btn_theme btn_sm mt-2">Clear Filter</button>
            </div>
        ) : filteredItems.map((data, index)=>(
            <div className="col-lg-4 co-md-6 col-sm-12 col-12" key={index}>
                <div className="gallery_item mb-4" onClick={() => setSelectedImage(data)} style={{ cursor: 'pointer', position: 'relative' }}>
                    <div className="gallery_img_wrapper" style={{ overflow: 'hidden', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', backgroundColor: '#f0f0f0' }}>
                        <img src={data.image_url} alt={data.title} style={{ height: '300px', width: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="gallery_main_img" />
                    </div>
                    {/* ... (overlay stays the same) ... */}
                </div>
            </div>
        ))}
    </div>

            {/* Custom Premium Image Modal */}
            {selectedImage && (
                <div 
                    onClick={() => setSelectedImage(null)}
                    style={{ 
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
                        backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', 
                        zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: 'fadeIn 0.3s ease-out', cursor: 'zoom-out'
                    }}
                >
                    {/* Navigation Buttons */}
                    <button 
                        onClick={handlePrev}
                        disabled={filteredItems.findIndex(i => i.id === selectedImage.id) === 0}
                        style={{ 
                            position: 'absolute', left: '30px', background: 'rgba(255,255,255,0.2)', 
                            border: 'none', color: 'white', width: '60px', height: '60px', 
                            borderRadius: '50%', cursor: 'pointer', fontSize: '24px', zIndex: 10001,
                            transition: '0.3s', pointerEvents: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>

                    <button 
                        onClick={handleNext}
                        disabled={filteredItems.findIndex(i => i.id === selectedImage.id) === filteredItems.length - 1}
                        style={{ 
                            position: 'absolute', right: '30px', background: 'rgba(255,255,255,0.2)', 
                            border: 'none', color: 'white', width: '60px', height: '60px', 
                            borderRadius: '50%', cursor: 'pointer', fontSize: '24px', zIndex: 10001,
                            transition: '0.3s', pointerEvents: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>

                    <div 
                        style={{ 
                            position: 'relative', maxWidth: '85%', maxHeight: '85%', 
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px'
                        }} 
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button - Moved down slightly */}
                        <button 
                            onClick={() => setSelectedImage(null)}
                            style={{ 
                                position: 'absolute', top: '-15px', right: '-15px', 
                                background: 'white', border: 'none', width: '40px', height: '40px', 
                                borderRadius: '50%', cursor: 'pointer', fontWeight: '800', fontSize: '20px',
                                boxShadow: '0 5px 15px rgba(227, 49, 41, 0.4)', color: '#e33129', zIndex: 10005
                            }}
                        >
                            &times;
                        </button>

                        <img 
                            key={selectedImage.id}
                            src={selectedImage.image_url} 
                            alt={selectedImage.title} 
                            style={{ 
                                maxWidth: '100%', maxHeight: '70vh', 
                                borderRadius: '15px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                                animation: 'zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                objectFit: 'contain'
                            }} 
                        />

                        {/* Centered Caption Bubble */}
                        <div style={{ 
                            backgroundColor: 'white', padding: '12px 30px', borderRadius: '30px', 
                            textAlign: 'center', animation: 'slideUp 0.4s',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)', width: 'fit-content'
                        }}>
                            <h4 style={{ margin: 0, fontWeight: 800, color: '#222', fontSize: '15px' }}>{selectedImage.title}</h4>
                            <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#999', fontWeight: '600' }}>
                                Image {filteredItems.findIndex(i => i.id === selectedImage.id) + 1} of {filteredItems.length}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes zoomIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    </section>
    </>
  )
}

export default GalleryArea