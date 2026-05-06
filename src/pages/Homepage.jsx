import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerCompany } from "../services/api.js"; // ✅ use api.js — single URL source

export default function Homepage() {
  const navigate = useNavigate();
  const [newCompany, setNewCompany] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegisterCompany = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ Now goes to HF Space → Neon DB (same as everything else)
      await registerCompany({ name: newCompany });
      setMsg(`Company '${newCompany}' registered successfully!`);
      setNewCompany("");
    } catch (err) {
      setMsg(err.message || "Failed to register company.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#F8FAFC", fontFamily: '"Inter", system-ui, sans-serif' }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ width: 64, height: 64, background: "linear-gradient(135deg,#4F46E5,#3B82F6)", borderRadius: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 28, boxShadow: "0 8px 24px rgba(79,70,229,.35)", marginBottom: 16 }}>L</div>
        <h1 style={{ fontSize: 42, fontWeight: 800, color: "#0F172A", margin: "0 0 10px" }}>Lumora</h1>
        <p style={{ color: "#64748B", margin: 0, fontSize: 16 }}>Organizational Emotion Intelligence</p>
      </div>

      <div style={{ display: "flex", gap: 20, marginBottom: 40 }}>
        <button onClick={() => navigate("/employee/login")} style={{ padding: "14px 28px", borderRadius: 10, border: "none", background: "#4F46E5", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 15, boxShadow: "0 4px 12px rgba(79,70,229,.25)" }}>
          Employee Portal
        </button>
        <button onClick={() => navigate("/hr/login")} style={{ padding: "14px 28px", borderRadius: 10, border: "none", background: "#0F172A", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 15 }}>
          HR Dashboard
        </button>
      </div>

      <div style={{ background: "#fff", padding: "32px", borderRadius: 20, boxShadow: "0 4px 24px rgba(0,0,0,.08)", width: "100%", maxWidth: 400, boxSizing: "border-box" }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 18, color: "#0F172A" }}>Register a New Company</h3>
        {msg && (
          <p style={{ fontSize: 13, color: msg.includes("success") ? "#166534" : "#991B1B", background: msg.includes("success") ? "#DCFCE7" : "#FEF2F2", padding: "10px", borderRadius: 8, marginBottom: 16 }}>
            {msg}
          </p>
        )}
        <form onSubmit={handleRegisterCompany} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ display: "block", marginBottom: 5, fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "uppercase" }}>Company Name</label>
            <input
              type="text"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              required
              style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, boxSizing: "border-box", outline: "none" }}
            />
          </div>
          <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px", background: "#F1F5F9", color: "#0F172A", border: "none", borderRadius: 10, cursor: loading ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 14, marginTop: 4 }}>
            {loading ? "Registering..." : "Register Company"}
          </button>
        </form>
      </div>
    </div>
  );
}
