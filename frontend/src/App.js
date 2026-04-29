import React, { useState } from "react";

const CROPS = [
  { id: "maize",     label: "Maize",     icon: "🌽" },
  { id: "tomato",    label: "Tomato",    icon: "🍅" },
  { id: "wheat",     label: "Wheat",     icon: "🌾" },
  { id: "sugarcane", label: "Sugarcane", icon: "🪨" },
];

export default function App() {
  const [crop, setCrop]         = useState("maize");
  const [image, setImage]       = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);

  const handleFile = (file) => {
    if (!file) return;
    setImage(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!image || loading) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("crop", crop);
      formData.append("image", image);
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch {
      setResult({
        prediction: "Connection failed",
        confidence: 0,
        organic_solutions: [],
        chemical_solutions: ["Could not reach backend at localhost:5000"],
      });
    }
    setLoading(false);
  };

  const handleReset = () => {
    setResult(null);
    setImage(null);
    setImageUrl(null);
  };

  const conf     = result?.confidence || 0;
  const confPct  = Math.round(conf * 100);
  const confClass = conf >= 0.8 ? styles.confHigh : conf >= 0.5 ? styles.confMid : styles.confLow;
  const confLabel = conf >= 0.8 ? "High confidence" : conf >= 0.5 ? "Medium confidence" : "Low confidence";

  return (
    <>
      <style>{css}</style>
      <div style={styles.root}>
        <div style={styles.wrapper}>

          {/* ── Header ── */}
          <div style={styles.header}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2C6.5 2 3 7 3 12c0 4 2.5 7.5 6 9"/>
                  <path d="M12 2c5.5 0 9 5 9 10 0 4-2.5 7.5-6 9"/>
                  <line x1="12" y1="21" x2="12" y2="12"/>
                  <path d="M12 12 8 8M12 12l4-3"/>
                </svg>
              </div>
              <h1 style={styles.title}>Farm Doctor</h1>
            </div>
            <p style={styles.subtitle}>Upload a leaf image to diagnose crop disease</p>
          </div>

          {result ? (
            /* ── Result view ── */
            <div className="fd-fadein">
              <div style={styles.card}>
                <div style={styles.diagnosisHeader}>
                  <div>
                    <p style={styles.diseaseName}>{result.prediction || "Unknown disease"}</p>
                    <span style={{ ...styles.confidencePill, ...confClass }}>{confLabel}</span>
                  </div>
                  {imageUrl && (
                    <img src={imageUrl} alt="leaf" style={styles.thumbImg} />
                  )}
                </div>

                {/* Confidence bar */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={styles.smallMuted}>Model confidence</span>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{confPct}%</span>
                  </div>
                  <div style={styles.barTrack}>
                    <div style={{ ...styles.barFill, width: `${confPct}%` }} />
                  </div>
                </div>

                <span style={styles.label}>Recommended treatments</span>
                <div style={styles.solutionsGrid}>
                  <div style={styles.solSection}>
                    <p style={{ ...styles.solTitle, color: "#3B6D11" }}>Organic</p>
                    <ul style={styles.solList}>
                      {(result.organic_solutions || []).length
                        ? (result.organic_solutions || []).map((s, i) => (
                            <li key={i} style={styles.solItem}>
                              <span style={{ ...styles.dot, background: "#639922" }} />{s}
                            </li>
                          ))
                        : <li style={styles.solItemEmpty}>None listed</li>}
                    </ul>
                  </div>
                  <div style={styles.solSection}>
                    <p style={{ ...styles.solTitle, color: "#185FA5" }}>Chemical</p>
                    <ul style={styles.solList}>
                      {(result.chemical_solutions || []).length
                        ? (result.chemical_solutions || []).map((s, i) => (
                            <li key={i} style={styles.solItem}>
                              <span style={{ ...styles.dot, background: "#378ADD" }} />{s}
                            </li>
                          ))
                        : <li style={styles.solItemEmpty}>None listed</li>}
                    </ul>
                  </div>
                  <div style={styles.solSection}>
                    <p style={{ ...styles.solTitle, color: "#854F0B" }}>Prevention</p>
                    <ul style={styles.solList}>
                      {(result.prevention || []).length
                        ? (result.prevention || []).map((s, i) => (
                            <li key={i} style={styles.solItem}>
                              <span style={{ ...styles.dot, background: "#EF9F27" }} />{s}
                            </li>
                          ))
                        : <li style={styles.solItemEmpty}>None listed</li>}
                    </ul>
                  </div>
                </div>
              </div>

              <button onClick={handleReset} style={styles.resetBtn}
                onMouseEnter={e => { e.target.style.color = "#000"; e.target.style.borderColor = "rgba(0,0,0,0.4)"; }}
                onMouseLeave={e => { e.target.style.color = ""; e.target.style.borderColor = ""; }}>
                Run another diagnosis
              </button>
            </div>

          ) : (
            /* ── Form view ── */
            <>
              {/* Crop selector */}
              <div style={styles.card}>
                <span style={styles.label}>Select crop</span>
                <div style={styles.cropGrid}>
                  {CROPS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setCrop(c.id)}
                      style={{
                        ...styles.cropBtn,
                        ...(crop === c.id ? styles.cropBtnActive : {}),
                      }}
                    >
                      <span style={{ fontSize: 20, display: "block", marginBottom: 4 }}>{c.icon}</span>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image upload */}
              <div style={styles.card}>
                <span style={styles.label}>Leaf image</span>
                {imageUrl ? (
                  <div style={{ position: "relative" }}>
                    <img src={imageUrl} alt="Uploaded leaf" style={styles.preview} />
                    <button
                      onClick={() => { setImage(null); setImageUrl(null); }}
                      style={styles.changeBtn}
                    >
                      Change image
                    </button>
                  </div>
                ) : (
                  <label style={styles.uploadZone} className="fd-upload-zone">
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={e => handleFile(e.target.files[0])}
                    />
                    <div style={styles.uploadIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                        <polyline points="16 16 12 12 8 16"/>
                        <line x1="12" y1="12" x2="12" y2="21"/>
                        <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
                      </svg>
                    </div>
                    <p style={styles.uploadText}>
                      <strong style={{ color: "#3B6D11", fontWeight: 500 }}>Click to upload</strong> or drag & drop
                      <br />JPG, PNG up to 10MB
                    </p>
                  </label>
                )}
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading || !image}
                style={{
                  ...styles.submitBtn,
                  ...(loading || !image ? styles.submitBtnDisabled : {}),
                }}
              >
                {loading ? (
                  <>
                    <span className="fd-spinner" style={styles.spinner} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                    Diagnose disease
                  </>
                )}
              </button>
            </>
          )}

        </div>
      </div>
    </>
  );
}

/* ─── Styles ─────────────────────────────────────────────── */

const styles = {
  root: {
    fontFamily: "'DM Sans', sans-serif",
    maxWidth: 560,
    margin: "0 auto",
    padding: "2rem 1rem 3rem",
  },
  wrapper: {
    border: "0.5px solid rgba(0,0,0,0.25)",
    borderRadius: 16,
    padding: "1.5rem",
    background: "#f7f6f2",
  },
  header: { textAlign: "center", marginBottom: "2rem" },
  logo:   { display: "inline-flex", alignItems: "center", gap: 10, marginBottom: "0.5rem" },
  logoIcon: {
    width: 40, height: 40,
    background: "#3B6D11",
    borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 26, fontWeight: 600,
    margin: 0, letterSpacing: "-0.3px",
  },
  subtitle: { fontSize: 13, color: "#666", margin: "4px 0 0" },
  card: {
    background: "#fff",
    border: "0.5px solid rgba(0,0,0,0.1)",
    borderRadius: 12,
    padding: "1.5rem",
    marginBottom: "1rem",
  },
  label: {
    fontSize: 11, fontWeight: 500,
    letterSpacing: "0.08em", textTransform: "uppercase",
    color: "#888", marginBottom: 8, display: "block",
  },
  cropGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 },
  cropBtn: {
    background: "#f5f4f0",
    border: "0.5px solid rgba(0,0,0,0.1)",
    borderRadius: 8,
    padding: "10px 6px",
    cursor: "pointer",
    textAlign: "center",
    fontFamily: "'DM Sans', sans-serif",
    color: "#666",
    fontSize: 12,
    transition: "all 0.15s",
  },
  cropBtnActive: {
    background: "#EAF3DE",
    borderColor: "#639922",
    color: "#27500A",
    fontWeight: 500,
  },
  uploadZone: {
    border: "1.5px dashed rgba(0,0,0,0.2)",
    borderRadius: 8,
    padding: "2rem 1rem",
    textAlign: "center",
    cursor: "pointer",
    display: "block",
  },
  uploadIcon: {
    width: 36, height: 36,
    background: "#f5f4f0",
    borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 10px",
  },
  uploadText: { fontSize: 13, color: "#666", margin: 0 },
  preview: {
    width: "100%", height: 160,
    objectFit: "cover", borderRadius: 8, display: "block",
  },
  changeBtn: {
    position: "absolute", bottom: 8, right: 8,
    background: "rgba(0,0,0,0.6)", color: "#fff",
    fontSize: 11, padding: "4px 10px",
    borderRadius: 20, border: "none", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  submitBtn: {
    width: "100%", padding: 13,
    background: "#3B6D11", color: "#fff",
    border: "none", borderRadius: 8,
    fontSize: 14, fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    marginTop: "1rem",
    transition: "background 0.15s",
  },
  submitBtnDisabled: { background: "#B4B2A9", cursor: "not-allowed" },
  spinner: {
    width: 16, height: 16,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    display: "inline-block",
  },
  diagnosisHeader: {
    display: "flex", alignItems: "flex-start",
    justifyContent: "space-between", gap: 12,
    marginBottom: "1rem",
  },
  diseaseName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 20, fontWeight: 600,
    margin: "0 0 4px", lineHeight: 1.2,
  },
  confidencePill: {
    fontSize: 11, fontWeight: 500,
    padding: "3px 10px", borderRadius: 20,
    whiteSpace: "nowrap",
  },
  confHigh: { background: "#EAF3DE", color: "#27500A" },
  confMid:  { background: "#FAEEDA", color: "#633806" },
  confLow:  { background: "#FCEBEB", color: "#501313" },
  thumbImg: { width: 60, height: 60, objectFit: "cover", borderRadius: 8, flexShrink: 0 },
  smallMuted: { fontSize: 12, color: "#888" },
  barTrack: { height: 4, background: "#f0efe9", borderRadius: 2, overflow: "hidden", marginTop: 6 },
  barFill:  { height: "100%", background: "#639922", borderRadius: 2, transition: "width 0.8s ease" },
  solutionsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 },
  solSection: { background: "#f7f6f2", borderRadius: 8, padding: 12 },
  solTitle: { fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 8px" },
  solList:  { listStyle: "none", margin: 0, padding: 0 },
  solItem:  { fontSize: 12, color: "#666", padding: "3px 0", borderBottom: "0.5px solid rgba(0,0,0,0.08)", lineHeight: 1.4 },
  solItemEmpty: { fontSize: 12, color: "#aaa" },
  dot: { display: "inline-block", width: 5, height: 5, borderRadius: "50%", marginRight: 6, verticalAlign: "middle", position: "relative", top: -1 },
  resetBtn: {
    width: "100%", marginTop: 12, padding: 10,
    background: "transparent",
    border: "0.5px solid rgba(0,0,0,0.2)",
    borderRadius: 8,
    fontSize: 13, color: "#666",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.15s",
  },
};

/* ─── Global CSS (animations, Google Fonts) ──────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@400;500&display=swap');

  .fd-fadein {
    animation: fd-fadein 0.4s ease;
  }
  @keyframes fd-fadein {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0);   }
  }

  .fd-spinner {
    animation: fd-spin 0.7s linear infinite;
  }
  @keyframes fd-spin { to { transform: rotate(360deg); } }

  .fd-upload-zone:hover {
    border-color: #639922 !important;
    background: rgba(99,153,34,0.04);
  }
`;
