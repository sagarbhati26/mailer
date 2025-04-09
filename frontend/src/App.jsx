import { useState } from "react";
import axios from "axios";

function App() {
  const [emails, setEmails] = useState([
    { Name: "", Email: "", Subject: "", Message: "" },
  ]);
  const [status, setStatus] = useState("");

  const handleChange = (index, field, value) => {
    const newEmails = [...emails];
    newEmails[index][field] = value;
    setEmails(newEmails);
  };

  const addRow = () => {
    setEmails([...emails, { Name: "", Email: "", Subject: "", Message: "" }]);
  };

  const handleSend = async () => {
    setStatus("Sending...");
    try {
      const res = await axios.post(
        "http://localhost:5005/api/emails/send",
        emails,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setStatus(res.data.message || "Emails sent!");
    } catch (error) {
      setStatus("Failed to send emails.");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📤 Bulk Email Sender</h2>
      {emails.map((row, index) => (
        <div key={index} style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Name"
            value={row.Name}
            onChange={(e) => handleChange(index, "Name", e.target.value)}
            style={{ marginRight: "0.5rem" }}
          />
          <input
            type="email"
            placeholder="Email"
            value={row.Email}
            onChange={(e) => handleChange(index, "Email", e.target.value)}
            style={{ marginRight: "0.5rem" }}
          />
          <input
            type="text"
            placeholder="Subject"
            value={row.Subject}
            onChange={(e) => handleChange(index, "Subject", e.target.value)}
            style={{ marginRight: "0.5rem", width: "200px" }}
          />
          <input
            type="text"
            placeholder="Message"
            value={row.Message}
            onChange={(e) => handleChange(index, "Message", e.target.value)}
            style={{ width: "300px" }}
          />
        </div>
      ))}
      <button onClick={addRow} style={{ marginRight: "1rem" }}>➕ Add More</button>
      <button onClick={handleSend}>📨 Send Emails</button>
      <div style={{ marginTop: "1rem", fontWeight: "bold" }}>{status}</div>
    </div>
  );
}

export default App;