import React, { useState, useEffect } from "react";

import { supabase } from "../../supabase";
import { formatDate } from "../../utils/dateFormatter";
import CommonBanner from "../../component/Common/CommonBanner";

const AdminEventsPage = () => {
    const [events, setEvents] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const fetchEvents = async () => {
        setFetching(true);
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('startAt', { ascending: false });
            
            if (error) throw error;
            setEvents(data || []);
        } catch (error) {
            console.error("Error fetching events from Supabase: ", error);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let imageUrl = null;

            // Optional: Image upload logic
            if (image) {
                const fileExt = image.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `event-images/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('JYF')
                    .upload(filePath, image);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from('JYF')
                    .getPublicUrl(filePath);
                
                imageUrl = data.publicUrl;
            }

            const { error } = await supabase
                .from('events')
                .insert([
                    {
                        title,
                        description,
                        startAt: new Date(date).toISOString(),
                        status: "published",
                        image_url: imageUrl
                    }
                ]);

            if (error) throw error;

            setTitle("");
            setDescription("");
            setDate("");
            setImage(null);
            await fetchEvents();
            alert("Event added successfully to Supabase!");
        } catch (error) {
            console.error("Error adding event to Supabase: ", error);
            alert(`Failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <CommonBanner heading="Manage Events" pagination="Manage Events" />
            <section className="section_padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5">
                            <div className="author_form_area">
                                <h3>Add New Event</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Event Title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <textarea
                                            className="form-control"
                                            placeholder="Event Description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows="4"
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="form-group mb-3">
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="form-label">Event Image (Optional)</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn_theme btn_md" disabled={loading}>
                                        {loading ? "Uploading..." : "Add Event"}
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="details_wrapper_area">
                                <h3>Existing Events</h3>
                                {fetching ? (
                                    <p>Loading events...</p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Date</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {events.map((event) => (
                                                    <tr key={event.id}>
                                                        <td>{event.title}</td>
                                                        <td>{formatDate(event.startAt)}</td>
                                                        <td><span className="badge bg-success">{event.status}</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AdminEventsPage;
