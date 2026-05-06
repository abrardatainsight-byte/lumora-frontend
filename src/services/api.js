const BASE = "https://lumora-backend-x6vt.onrender.com";

async function req(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...opts.headers },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

// Auth & Companies
export const registerCompany = async (data) => {
  const res = await fetch("https://lumora-backend-x6vt.onrender.com/register-company", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: `Server error: ${res.status}` }));
    throw new Error(err.detail || `Server error: ${res.status}`);
  }
  
  return res.json();
};

export const getCompanies = () =>
  req("/companies");

export const register = (data) =>
  req("/register", { method: "POST", body: JSON.stringify(data) });

export const login = (data) =>
  req("/login", { method: "POST", body: JSON.stringify(data) });

// Trigger
export const triggerCapture = () =>
  req("/trigger-capture", { method: "POST" });

export const checkTrigger = () => req("/check-trigger");

// HR analytics — all accept a range and company param
export const getGlobalPulse = (range = "week", company) =>
  req(`/hr/global-pulse?range=${range}&company=${encodeURIComponent(company)}`);

export const getDistribution = (range = "week", company) =>
  req(`/hr/distribution?range=${range}&company=${encodeURIComponent(company)}`);

export const getWeeklyTrend = (company) => 
  req(`/hr/weekly-trend?company=${encodeURIComponent(company)}`);

export const getIntensity = (company) => 
  req(`/hr/intensity?company=${encodeURIComponent(company)}`);

export const getResults = (range = "week", company) =>
  req(`/hr/results?range=${range}&company=${encodeURIComponent(company)}`);

export const getEmployees = (range = "week", search = "", company) =>
  req(`/hr/employees?range=${range}&search=${encodeURIComponent(search)}&company=${encodeURIComponent(company)}`);

export const getMatrix = (range = "week", company) =>
  req(`/hr/matrix?range=${range}&company=${encodeURIComponent(company)}`);

// Employee analyze — FormData, NOT JSON
export const analyzeEmotion = (username, blob) => {
  const form = new FormData();
  form.append("username", username);
  form.append("file", blob, "capture.jpg");
  return fetch(`${BASE}/analyze`, { method: "POST", body: form }).then((r) =>
    r.json()
  );
};

// Emotion colour map
export const EMOTION_COLORS = {
  Happy:      "#F4A261",
  Neutral:    "#94A3B8",
  Stress:     "#E76F51",
  Drowsiness: "#8B7EC8",
  Sad:        "#60A5FA",
  Angry:      "#EF4444",
  Fear:       "#A78BFA",
  Surprise:   "#34D399",
  Disgust:    "#6B7280",
};

export const ALL_EMOTIONS = Object.keys(EMOTION_COLORS);

export function relativeTime(iso) {
  if (!iso) return "—";
  const d = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (d < 60) return `${d}s ago`;
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}
