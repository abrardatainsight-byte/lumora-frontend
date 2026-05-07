const BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : "/api";

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
export const registerCompany = (data) =>
  req("/register-company", { method: "POST", body: JSON.stringify(data) });

export const getCompanies = () => req("/companies");

export const register = (data) =>
  req("/register", { method: "POST", body: JSON.stringify(data) });

export const login = (data) =>
  req("/login", { method: "POST", body: JSON.stringify(data) });

// Trigger
export const triggerCapture = (company) =>
  req(`/trigger-capture?company=${encodeURIComponent(company)}`, { method: "POST" });

export const checkTrigger = (company) =>
  req(`/check-trigger?company=${encodeURIComponent(company)}`);

// HR analytics
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

// NEW: Emotion analysis bypasses FormData and sends JSON Text instead
export const analyzeEmotion = (username, base64Image) => {
  return req(`/analyze`, { 
    method: "POST", 
    body: JSON.stringify({ 
      username: username, 
      image_base64: base64Image 
    }) 
  });
};

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

export const relativeTime = (isoString) => {
  if (!isoString) return "Never";
  let tzStr = isoString;
  if (!tzStr.endsWith("Z") && !tzStr.includes("+")) tzStr += "Z";
  const date = new Date(tzStr);
  const diff = Math.floor((new Date() - date) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};
