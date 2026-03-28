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
                        <div className="volunteer_wrapper">
                            <div className="volunteer_img">
                                <img src={data.image_url || "/default-avatar.png"} alt="img" style={{ height: "300px", objectFit: "cover", width: "100%" }} />
                                <div className="volunteer_icon">
                                    <ul>
                                        <li>
                                            <a href="https://www.facebook.com/groups/jyf.mulund/" target="_blank"><i className="fab fa-facebook"></i></a>
                                        </li>
                                        <li>
                                            <a href="https://x.com/jyf_india" target="_blank"><i className="fab fa-x-twitter"></i></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
    
                            <div className="volunteer_text">
                                <h3><a href="#!">{data.name}</a></h3>
                                <p>{data.role}</p>
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