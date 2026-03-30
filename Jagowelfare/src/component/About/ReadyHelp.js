import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
// Import Img
import DefaultImg from "../../assets/img/volunteer/volunteer-1.png"

const ReadyHelp = () => {
    const [teamData, setTeamData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                // Try sorting by priority first
                const { data, error } = await supabase
                    .from('team')
                    .select('*')
                    .order('priority', { ascending: false })
                    .order('created_at', { ascending: false })
                    .limit(10);
                
                if (error) {
                    console.warn("Priority column might be missing. Falling back to date sorting.", error);
                    const { data: fallbackData, error: fallbackError } = await supabase
                        .from('team')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(10);
                    if (fallbackError) throw fallbackError;
                    setTeamData(fallbackData || []);
                } else {
                    setTeamData(data || []);
                }
            } catch (err) {
                console.error("Error fetching team data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);

    // Create an array of 10 items, filled with real data or placeholders if needed
    // But usually we just show real data. The user said "total 10 box chahiye".
    // I will show real data, but if they want EXACTLY 10 boxes even if empty:
    const displayData = [...teamData];
    // If you want to force 10 boxes:
    // while(displayData.length < 10) displayData.push({ name: "Joining Soon", role: "Volunteer", image_url: "" });

    return (
        <>
            <section id="volunteer_area" className="section_after section_padding bg-color">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
                            <div className="section_heading">
                                <h2> Core Team
                                    <span className="color_big_heading"> Members</span></h2>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        {displayData.map((data, index) => (
                            <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4" key={index}>
                                <div className="volunteer_wrapper" style={{ height: "100%", backgroundColor: "#fff", borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0", display: "flex", flexDirection: "column" }}>
                                    <div className="volunteer_img" style={{ height: "350px", overflow: "hidden", flexShrink: 0 }}>
                                        <img 
                                            src={data.image_url || DefaultImg} 
                                            alt="img" 
                                            style={{ 
                                                width: "100%", 
                                                height: "100%", 
                                                objectFit: "cover", 
                                                objectPosition: "top center" 
                                            }} 
                                        />
                                    </div>

                                    <div className="volunteer_text" style={{ padding: "20px", textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                        <h3 style={{ fontSize: "19px", fontWeight: "700", marginBottom: "5px", color: "#222" }}>{data.name}</h3>
                                        <p style={{ margin: 0, color: "#666", fontSize: "13px", lineHeight: "1.4" }}>{data.role || data.title}</p>
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

export default ReadyHelp