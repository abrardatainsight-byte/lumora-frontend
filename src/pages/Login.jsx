import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register as apiRegister, login as apiLogin, getCompanies } from "../services/api.js";

export default function Login({ type: initialType }) {
  const navigate = useNavigate();
  const [role, setRole] = useState(initialType || "employee");
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", company: "" });
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // NEW: Explicit state to track network activity vs empty data
  const [fetchingCompanies, setFetchingCompanies] = useState(true);

  // Fetch companies for the dropdown on mount
  useEffect(() => {
    getCompanies()
      .then(res => {
        setCompanies(res.companies || []);
        setFetchingCompanies(false); // Done loading, even if empty
      })
      .catch(err => {
        console.error("Failed to load companies:", err);
        setFetchingCompanies(false); // Stop loading on error
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    
    // Prevent submission if no company is selected
    if (!form.company) {
        setError("Please select a company.");
        setLoading(false);
        return;
    }

    try {
      const payload = { ...form, role };
      const data = isRegistering ? await apiRegister(payload) : await apiLogin(payload);
      
      const prefix = data.role === "hr" ? "hr" : "employee";
      localStorage.setItem(`${prefix}_username`, data.username || form.username);
      localStorage.setItem(`${prefix}_company`, data.company || form.company);
      
      navigate(data.role === "hr" ? "/hr/dashboard" : "/employee/portal");
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#F8FAFC", fontFamily: '"Inter", system-ui, sans-serif' }}>
      <div style={{ background: "#fff", padding: "40px", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,.08)", width: "100%", maxWidth: 400, boxSizing: "border-box" }}>
        <h2 style={{ margin: "0 0 24px", fontSize: 24, color: "#0F172A", textAlign: "center" }}>
          {isRegistering ? "Create Account" : "Welcome Back"}
        </h2>
        
        {error && <p style={{ fontSize: 13, color: "#991B1B", background: "#FEF2F2", padding: "10px", borderRadius: 8, marginBottom: 16 }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", marginBottom: 5, fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "uppercase" }}>Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, outline: "none" }}>
              <option value="employee">Employee</option>
              <option value="hr">HR Administrator</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 5, fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "uppercase" }}>Company</label>
            <select 
              value={form.company} 
              onChange={e => setForm({ ...form, company: e.target.value })} 
              required
              style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, outline: "none", background: "#fff" }}
            >
              <option value="">Select Company</option>
              {fetchingCompanies ? (
                <option disabled>Loading companies...</option>
              ) : companies.length === 0 ? (
                <option disabled>No companies found.</option>
              ) : (
                companies.map(c => <option key={c} value={c}>{c}</option>)
              )}
            </select>
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: 5, fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "uppercase" }}>Username</label>
            <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required
              style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: 5, fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "uppercase" }}>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
              style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
          </div>
          
          <button type="submit" disabled={loading || fetchingCompanies || companies.length === 0}
            style={{ width: "100%", padding: "13px 0", background: (loading || fetchingCompanies || companies.length === 0) ? "#94A3B8" : "linear-gradient(135deg,#4F46E5,#3B82F6)", color: "#fff", border: "none", borderRadius: 10, cursor: (loading || fetchingCompanies || companies.length === 0) ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 15, marginTop: 4, boxShadow: (loading || fetchingCompanies || companies.length === 0) ? "none" : "0 4px 12px rgba(79,70,229,.35)", transition: "all .2s" }}>
            {loading ? "Please wait…" : isRegistering ? "Register" : "Login"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button onClick={() => setIsRegistering(!isRegistering)}
            style={{ background: "none", border: "none", color: "#4F46E5", cursor: "pointer", fontSize: 13, fontWeight: 500, textDecoration: "underline" }}>
            {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
          </button>
        </div>

        {/* Fallback link if the database is totally empty */}
        {companies.length === 0 && !fetchingCompanies && (
          <div style={{ textAlign: "center", marginTop: 20, paddingTop: 20, borderTop: "1px solid #E2E8F0" }}>
            <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 8px" }}>Database is currently empty.</p>
            <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "#4F46E5", cursor: "pointer", fontSize: 13, fontWeight: 600, textDecoration: "underline" }}>
              Go to Homepage to register a company
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
