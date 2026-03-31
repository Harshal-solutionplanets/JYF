import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabase'

const VolunteerArea = () => {
  const [team, setTeam] = useState([]);
  const [honorary, setHonorary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data: teamData, error: teamError } = await supabase.from('team').select('*').order('priority', { ascending: false }).order('created_at', { ascending: false });
        if (!teamError) setTeam(teamData || []);

        const { data: honData, error: honError } = await supabase.from('masters').select('*').eq('type', 'honorary_volunteer').order('priority', { ascending: false }).order('created_at', { ascending: false });
        if (!honError) setHonorary(honData || []);

      } catch (err) {
        console.error("Error fetching volunteers:", err);
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
                        <h2> Volunteer
                            <span className="color_big_heading"> Team</span></h2>
                    </div>
                </div>
            </div>
            
            {/* Team Members List */}
            <div className="row">
                {team.map((data, index)=>(
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
                ))}
            </div>

            {/* Static Volunteers Section (Without Images) */}
            <div className="row mt-5 pt-3" style={{ borderTop: "1px solid #eee" }}>
                <div className="col-12 mb-4">
                    <h3 style={{ fontWeight: "700", color: "#222" }}>Honorary Volunteers</h3>
                </div>
                {honorary.map((m, idx) => (
                    <div className="col-lg-4 col-md-6 col-12 mb-3" key={idx}>
                        <div style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "15px", borderLeft: "4px solid #ca1e14" }}>
                            <div style={{ width: "40px", height: "40px", backgroundColor: "#ca1e1415", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#ca1e14" }}>
                                <i className="fas fa-user"></i>
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>{m.value}</h4>
                                <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>Volunteer</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
    </>
  )
}

export default VolunteerArea
