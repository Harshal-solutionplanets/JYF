import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";

const AdminViewSupporter = ({ onEdit }) => {
    const [supporters, setSupporters] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSupporters = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('supporters').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setSupporters(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSupporters();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Delete this supporter?")) {
            try {
                const { error } = await supabase.from('supporters').delete().eq('id', id);
                if (error) throw error;
                setSupporters(supporters.filter(s => s.id !== id));
            } catch (err) {
                alert("Delete failed: " + err.message);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "20px" }}>
            <h3 style={{ marginBottom: "20px", fontWeight: "800" }}>Supporters List</h3>
            <div className="table-responsive">
                <table className="table align-middle">
                    <thead>
                        <tr>
                            <th>Logo</th>
                            <th>Name</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {supporters.map((s) => (
                            <tr key={s.id}>
                                <td><img src={s.image_url} alt="logo" style={{ width: "60px", height: "40px", objectFit: "contain" }} /></td>
                                <td style={{ fontWeight: "600" }}>{s.name}</td>
                                <td className="text-end">
                                    <button onClick={() => onEdit(s)} className="btn btn-sm btn-outline-warning me-2"><i className="fas fa-edit"></i></button>
                                    <button onClick={() => handleDelete(s.id)} className="btn btn-sm btn-outline-danger"><i className="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminViewSupporter;
