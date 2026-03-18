import React from "react";
import AdminQRScanner from "../page/admin/AdminQRScanner";

const QRScannerPage = () => {
    return (
        <div style={{ paddingTop: "120px", paddingBottom: "100px", minHeight: "80vh", backgroundColor: "#f9f9f9" }}>
            <div className="container">
                <AdminQRScanner />
            </div>
        </div>
    );
};

export default QRScannerPage;
