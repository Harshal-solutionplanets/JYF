import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../../supabase";

const AdminAddSadhuMedical = ({ onPublish, sadhuData }) => {
    const [name, setName] = useState("");
    const [personId, setPersonId] = useState("");
    const [gender, setGender] = useState("Male");
    const [age, setAge] = useState("");
    const [samudayName, setSamudayName] = useState("");
    const [entryDate, setEntryDate] = useState("");
    const [contactNumber, setContactNumber] = useState("");

    const [formImages, setFormImages] = useState([]);
    const [reportImages, setReportImages] = useState([]);
    const [prescriptionImages, setPrescriptionImages] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (sadhuData) {
            setName(sadhuData.name || "");
            setPersonId(sadhuData.person_id || "");
            setGender(sadhuData.gender || "Male");
            setAge(sadhuData.age || "");
            setSamudayName(sadhuData.samuday_name || "");
            setEntryDate(sadhuData.entry_date || "");
            setContactNumber(sadhuData.contact_number || "");
        }
    }, [sadhuData]);

    const handleImageChange = (e, setImagesList) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            // Check size max 1MB
            const validFiles = filesArray.filter(file => {
                if (file.size > 1 * 1024 * 1024) {
                    alert(`File ${file.name} is larger than 1MB`);
                    return false;
                }
                return true;
            });
            setImagesList(prev => [...prev, ...validFiles]);
        }
    };

    const removeImage = (index, setImagesList, isExisting = false) => {
        setImagesList(prev => prev.filter((_, i) => i !== index));
    };

    const uploadFiles = async (files, folder) => {
        const uploadedUrls = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (typeof file === 'string') {
                uploadedUrls.push(file); // Already a URL
                continue;
            }
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `sadhu_medical/${folder}/${fileName}`;
            const { error: uploadError } = await supabase.storage.from('sadhu_medical').upload(filePath, file);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('sadhu_medical').getPublicUrl(filePath);
            uploadedUrls.push(publicUrl);
        }
        return uploadedUrls;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (formImages.length === 0) return alert("Please upload at least one Form image.");
            if (reportImages.length === 0) return alert("Please upload at least one Report image.");
            if (prescriptionImages.length === 0) return alert("Please upload at least one Prescription image.");

            const formUrls = await uploadFiles(formImages, 'forms');
            const reportUrls = await uploadFiles(reportImages, 'reports');
            const prescriptionUrls = await uploadFiles(prescriptionImages, 'prescriptions');

            const payload = {
                name: name.trim(),
                person_id: personId.trim(),
                gender,
                age: age ? parseInt(age) : null,
                samuday_name: samudayName.trim(),
                entry_date: entryDate || null,
                contact_number: contactNumber.trim(),
                form_images: formUrls,
                report_images: reportUrls,
                prescription_images: prescriptionUrls
            };

            if (sadhuData && sadhuData.id) {
                const { error: updateError } = await supabase
                    .from('sadhu_medical_details')
                    .update(payload)
                    .eq('id', sadhuData.id);
                if (updateError) throw updateError;
                alert("Details updated successfully!");
            } else {
                const { error: insertError } = await supabase
                    .from('sadhu_medical_details')
                    .insert([payload]);
                if (insertError) throw insertError;
                alert("Details saved successfully!");
            }
            
            if (onPublish) onPublish();
        } catch (error) {
            alert("Submission failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { border: "1px solid #ddd", borderRadius: "8px", padding: "12px", width: "100%", fontSize: "15px", marginBottom: "20px" };
    const labelStyle = { fontWeight: "600", color: "#333", fontSize: "14px", marginBottom: "8px", display: "block" };
    const sectionHeadingStyle = { fontSize: "18px", fontWeight: "700", color: "#ca1e14", marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid #eee" };

    return (
        <div style={{ backgroundColor: "#fff", padding: "40px", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.05)" }}>
            <h3 style={{ marginBottom: "30px", fontWeight: "800", color: "#222" }}>
                {sadhuData ? "Edit Sadhu / Sadhviji Details" : "Add Sadhu / Sadhviji Details"}
            </h3>
            <form onSubmit={handleSubmit}>
                <div style={sectionHeadingStyle}>Personal Information</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div>
                        <label style={labelStyle}>Sadhu / Sadhviji Name</label>
                        <input type="text" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div>
                        <label style={labelStyle}>ID</label>
                        <input type="text" style={inputStyle} value={personId} onChange={(e) => setPersonId(e.target.value)} required />
                    </div>
                    <div>
                        <label style={labelStyle}>Gender</label>
                        <select style={inputStyle} value={gender} onChange={(e) => setGender(e.target.value)} required>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Age</label>
                        <input type="number" style={inputStyle} value={age} onChange={(e) => setAge(e.target.value)} required />
                    </div>
                    <div>
                        <label style={labelStyle}>Samuday Name</label>
                        <input type="text" style={inputStyle} value={samudayName} onChange={(e) => setSamudayName(e.target.value)} required />
                    </div>
                    <div>
                        <label style={labelStyle}>Date</label>
                        <input type="date" style={inputStyle} value={entryDate} onChange={(e) => setEntryDate(e.target.value)} required />
                    </div>
                    <div>
                        <label style={labelStyle}>Sevak / Mumukshu Contact Number</label>
                        <input type="text" style={inputStyle} value={contactNumber} onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, ''))} maxLength="10" pattern="\d{10}" title="Please enter a valid 10-digit number" placeholder="10-digit mobile number" />
                    </div>
                </div>

                <div style={sectionHeadingStyle} className="mt-4">Uploads (Max 1MB per image)</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                    {/* Form Images */}
                    <div>
                        <label style={labelStyle}>Form of Sadhu/Sadhviji</label>
                        <input type="file" multiple accept="image/*" onChange={(e) => handleImageChange(e, setFormImages)} style={{ marginBottom: "10px", width: "100%" }} />
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                            {formImages.map((file, i) => (
                                <div key={i} style={{ position: "relative" }}>
                                    <span style={{ fontSize: "12px" }}>{typeof file === 'string' ? "Uploaded" : file.name}</span>
                                    <button type="button" onClick={() => removeImage(i, setFormImages)} style={{ color: "red", marginLeft: "5px", border: "none", background: "none", cursor: "pointer" }}>x</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Reports Images */}
                    <div>
                        <label style={labelStyle}>Reports</label>
                        <input type="file" multiple accept="image/*" onChange={(e) => handleImageChange(e, setReportImages)} style={{ marginBottom: "10px", width: "100%" }} />
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                            {reportImages.map((file, i) => (
                                <div key={i} style={{ position: "relative" }}>
                                    <span style={{ fontSize: "12px" }}>{typeof file === 'string' ? "Uploaded" : file.name}</span>
                                    <button type="button" onClick={() => removeImage(i, setReportImages)} style={{ color: "red", marginLeft: "5px", border: "none", background: "none", cursor: "pointer" }}>x</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Prescription Images */}
                    <div>
                        <label style={labelStyle}>Doctor Prescription</label>
                        <input type="file" multiple accept="image/*" onChange={(e) => handleImageChange(e, setPrescriptionImages)} style={{ marginBottom: "10px", width: "100%" }} />
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                            {prescriptionImages.map((file, i) => (
                                <div key={i} style={{ position: "relative" }}>
                                    <span style={{ fontSize: "12px" }}>{typeof file === 'string' ? "Uploaded" : file.name}</span>
                                    <button type="button" onClick={() => removeImage(i, setPrescriptionImages)} style={{ color: "red", marginLeft: "5px", border: "none", background: "none", cursor: "pointer" }}>x</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-5 text-center">
                    <button type="submit" className="btn btn_theme btn_md" disabled={loading} style={{ padding: "10px 40px", fontSize: "16px", fontWeight: "700" }}>
                        {loading ? "Saving..." : (sadhuData ? "Update Details" : "Save Details")}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminAddSadhuMedical;
