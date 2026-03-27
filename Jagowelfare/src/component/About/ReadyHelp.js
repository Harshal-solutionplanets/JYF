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
                const { data, error } = await supabase
                    .from('team')
                    .select('*')
                    .limit(10);
                
                if (error) throw error;
                setTeamData(data || []);
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
                                <h3>Ready to help</h3>
                                <h2> Core Team
                                    <span className="color_big_heading"> Members</span></h2>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        {displayData.map((data, index) => (
                            <div className="col-lg-3 col-md-4 col-sm-6 col-12" key={index}>
                                <div className="volunteer_wrapper" style={{ marginBottom: "30px" }}>
                                    <div className="volunteer_img" style={{ height: "345px", overflow: "hidden" }}>
                                        <img 
                                            src={data.image_url || DefaultImg} 
                                            alt="img" 
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                        />
                                        <div className="volunteer_icon">
                                            <ul>
                                                {data.company_url && (
                                                    <li>
                                                        <a href={data.company_url} target="_blank" rel="noopener noreferrer" title={data.company_name}><i className="fas fa-link"></i></a>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="volunteer_text">
                                        <h3><a href="#!">{data.name}</a></h3>
                                        <p>{data.role || data.title}</p>
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