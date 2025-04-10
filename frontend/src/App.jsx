import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select an Excel file first.");
      return;
    }

    setStatus("Uploading...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5005/api/emails/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setStatus(res.data.message || "Emails sent!");
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("Failed to upload and send emails.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📤 Bulk Email Sender via Excel</h2>
      
      <input type="file" accept=".xlsx" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: "1rem" }}>📨 Upload & Send</button>

      <div style={{ marginTop: "1rem", fontWeight: "bold" }}>{status}</div>
    </div>
  );
}

export default App;