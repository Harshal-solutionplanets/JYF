import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabase'

const TeamArea = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        // Try sorting by priority first
        const { data, error } = await supabase.from('team').select('*').order('priority', { ascending: false }).order('created_at', { ascending: false });
        
        if (error) {
          console.warn("Priority column might be missing. Falling back to date sorting.", error);
          const { data: fallbackData, error: fallbackError } = await supabase.from('team').select('*').order('created_at', { ascending: false });
          if (fallbackError) throw fallbackError;
          setTeam(fallbackData || []);
        } else {
          setTeam(data || []);
        }
      } catch (err) {
        console.error("Error fetching team:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading) return <div className="text-center p-5"><h3>Loading Volunteers...</h3></div>;

  return (
    <>
      <section id="volunteer_area_main" className="section_padding">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
                    <div className="section_heading">
                        <h3>Ready to help</h3>
                        <h2> We have thousands of happy
                            volunteer to <span className="color_big_heading">help</span> you</h2>
                    </div>
                </div>
            </div>
            <div className="row">
                {team.length === 0 ? (
                    <div className="col-12 text-center text-muted">No volunteers found.</div>
                ) : (
                    team.map((data, index)=>(
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4" key={index}>
                        <div className="volunteer_wrapper" style={{ height: "100%", backgroundColor: "#fff", borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0", display: "flex", flexDirection: "column" }}>
                            <div className="volunteer_img" style={{ height: "350px", overflow: "hidden", flexShrink: 0 }}>
                                <img 
                                    src={data.image_url || "/default-avatar.png"} 
                                    alt="img" 
                                    style={{ 
                                        height: "100%", 
                                        objectFit: "cover", 
                                        width: "100%", 
                                        objectPosition: "top center" 
                                    }} 
                                />
                            </div>
    
                            <div className="volunteer_text" style={{ padding: "20px", textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                <h3 style={{ fontSize: "19px", fontWeight: "700", marginBottom: "5px", color: "#222" }}>{data.name}</h3>
                                <p style={{ margin: 0, color: "#666", fontSize: "13px", lineHeight: "1.4" }}>{data.role}</p>
                            </div>
                        </div>
                    </div>
                    ))
                )}
            </div>
        </div>
    </section>
    </>
  )
}

export default TeamArea