import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import CommonBanner from "../../component/Common/CommonBanner";

const AdminEventsPage = () => {
    const [events, setEvents] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const fetchEvents = async () => {
        setFetching(true);
        try {
            const q = query(collection(db, "events"), orderBy("startAt", "desc"));
            const querySnapshot = await getDocs(q);
            const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEvents(eventsData);
        } catch (error) {
            console.error("Error fetching events: ", error);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, "events"), {
                title,
                description,
                startAt: new Date(date),
                status: "published",
                createdAt: serverTimestamp()
            });
            setTitle("");
            setDescription("");
            setDate("");
            await fetchEvents();
            alert("Event added successfully!");
        } catch (error) {
            console.error("Error adding event: ", error);
            alert("Failed to add event.");
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
                                    <button type="submit" className="btn btn_theme btn_md" disabled={loading}>
                                        {loading ? "Adding..." : "Add Event"}
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
                                                        <td>{event.startAt?.seconds ? new Date(event.startAt.seconds * 1000).toLocaleDateString() : "No Date"}</td>
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
