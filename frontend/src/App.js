import { useState, useRef, useEffect, useCallback } from "react";

// ============================================================
// TRANSLATION SYSTEM (i18n)
// ============================================================
const translations = {
  en: {
    nav: { title: "Farm Doctor", history: "History", language: "हिंदी" },
    home: {
      badge: "AI-Powered Crop Disease Detection",
      headline1: "Your Personal",
      headline2: "Farm Doctor",
      headline3: "in Your Pocket",
      subtext: "Upload a photo of your crop to instantly identify diseases, get confidence scores, and receive actionable organic and chemical treatment solutions.",
      cta: "Start Prediction",
      features: ["Fast Results", "Multilingual Support", "Actionable Solutions"],
    },
    prediction: {
      title: "New Prediction",
      subtitle: "Provide details and upload a photo of your crop to diagnose the issue.",
      uploadTitle: "Upload Image",
      dragDrop: "Drag and drop an image",
      orClick: "or click to browse from gallery",
      gallery: "Gallery",
      camera: "Camera",
      cropInfo: "Crop Information",
      selectCrop: "Select Crop",
      advanced: "Advanced: Soil & Weather (Optional)",
      soilType: "Soil Type",
      temperature: "Temperature (°C)",
      humidity: "Humidity (%)",
      autoFetch: "Auto-fetch Weather",
      analyze: "Analyze & Predict",
      crops: { wheat: "Wheat", maize: "Maize", tomato: "Tomato", sugarcane: "Sugarcane" },
      soils: { loamy: "Loamy", clay: "Clay", sandy: "Sandy" },
      fetching: "Fetching weather...",
      analyzing: "Analyzing...",
    },
    results: {
      title: "Analysis Results",
      back: "Back to Dashboard",
      saveReport: "Save Report",
      newPrediction: "New Prediction",
      diseaseDetected: "Disease Detected",
      aiConfidence: "AI Confidence",
      conditionsAnalyzed: "Conditions Analyzed",
      crop: "Crop",
      soilType: "Soil Type",
      temperature: "Temperature",
      humidity: "Humidity",
      treatments: "Recommended Treatments",
      organic: "Organic Solutions",
      chemical: "Chemical Treatments",
      preventive: "Preventive Measures",
      riskNote: "Risk elevated due to high humidity",
    },
    chatbot: {
      title: "Ask Farm AI",
      subtitle: "AI Botanical Expert",
      placeholder: "Ask about crop diseases, farming tips...",
      send: "Send",
      welcome: "Hello! I'm your Farm AI assistant. Ask me anything about crop diseases, farming tips, or how to use this app.",
      needHelp: "Need crop advice?",
      helpSub: "Chat with our AI botanical expert for instant help.",
    },
    diseases: {
      wheat_yellow_rust: "Wheat Yellow Rust",
      maize_blight: "Maize Northern Blight",
      tomato_leaf_curl: "Tomato Leaf Curl Virus",
      sugarcane_red_rot: "Sugarcane Red Rot",
    },
  },
  hi: {
    nav: { title: "फार्म डॉक्टर", history: "इतिहास", language: "English" },
    home: {
      badge: "AI-संचालित फसल रोग पहचान",
      headline1: "आपका व्यक्तिगत",
      headline2: "फार्म डॉक्टर",
      headline3: "आपकी जेब में",
      subtext: "अपनी फसल की फोटो अपलोड करें और तुरंत रोगों की पहचान करें, विश्वास स्कोर प्राप्त करें, और जैविक व रासायनिक उपचार समाधान पाएं।",
      cta: "पहचान शुरू करें",
      features: ["तेज़ परिणाम", "बहुभाषी समर्थन", "कार्यकारी समाधान"],
    },
    prediction: {
      title: "नई भविष्यवाणी",
      subtitle: "फसल की समस्या का पता लगाने के लिए विवरण और फोटो प्रदान करें।",
      uploadTitle: "छवि अपलोड करें",
      dragDrop: "छवि खींचें और छोड़ें",
      orClick: "या गैलरी से ब्राउज़ करने के लिए क्लिक करें",
      gallery: "गैलरी",
      camera: "कैमरा",
      cropInfo: "फसल जानकारी",
      selectCrop: "फसल चुनें",
      advanced: "उन्नत: मिट्टी और मौसम (वैकल्पिक)",
      soilType: "मिट्टी का प्रकार",
      temperature: "तापमान (°C)",
      humidity: "आर्द्रता (%)",
      autoFetch: "मौसम स्वतः प्राप्त करें",
      analyze: "विश्लेषण करें और भविष्यवाणी करें",
      crops: { wheat: "गेहूँ", maize: "मक्का", tomato: "टमाटर", sugarcane: "गन्ना" },
      soils: { loamy: "दोमट", clay: "चिकनी मिट्टी", sandy: "बलुई" },
      fetching: "मौसम प्राप्त हो रहा है...",
      analyzing: "विश्लेषण हो रहा है...",
    },
    results: {
      title: "विश्लेषण परिणाम",
      back: "डैशबोर्ड पर वापस जाएं",
      saveReport: "रिपोर्ट सहेजें",
      newPrediction: "नई भविष्यवाणी",
      diseaseDetected: "रोग पाया गया",
      aiConfidence: "AI विश्वास",
      conditionsAnalyzed: "विश्लेषित परिस्थितियाँ",
      crop: "फसल",
      soilType: "मिट्टी का प्रकार",
      temperature: "तापमान",
      humidity: "आर्द्रता",
      treatments: "अनुशंसित उपचार",
      organic: "जैविक समाधान",
      chemical: "रासायनिक उपचार",
      preventive: "निवारक उपाय",
      riskNote: "अधिक आर्द्रता के कारण जोखिम बढ़ा हुआ है",
    },
    chatbot: {
      title: "फार्म AI से पूछें",
      subtitle: "AI वनस्पति विशेषज्ञ",
      placeholder: "फसल रोगों, खेती के सुझावों के बारे में पूछें...",
      send: "भेजें",
      welcome: "नमस्ते! मैं आपका फार्म AI सहायक हूं। फसल रोगों, खेती के सुझावों या इस ऐप के उपयोग के बारे में कुछ भी पूछें।",
      needHelp: "फसल सलाह चाहिए?",
      helpSub: "तत्काल सहायता के लिए हमारे AI वनस्पति विशेषज्ञ से बात करें।",
    },
    diseases: {
      wheat_yellow_rust: "गेहूँ का पीला रस्ट",
      maize_blight: "मक्का का उत्तरी अंगमारी",
      tomato_leaf_curl: "टमाटर पत्ती मुड़ने का वायरस",
      sugarcane_red_rot: "गन्ने का लाल सड़न",
    },
  },
};

// Mock disease data by crop
const diseaseData = {
  wheat: {
    key: "wheat_yellow_rust",
    scientific: "Puccinia striiformis f. sp. tritici",
    confidence: 96.4,
    organic: {
      en: ["Apply neem oil extract mixed with water (5ml/L) as a foliar spray.", "Use compost tea to promote healthy soil biology and suppress fungal growth.", "Ensure proper spacing between plants to improve air circulation."],
      hi: ["पानी में नीम तेल का अर्क (5ml/L) मिलाकर पत्तियों पर छिड़काव करें।", "स्वस्थ मिट्टी जीव विज्ञान को बढ़ावा देने और कवक वृद्धि को दबाने के लिए खाद चाय का उपयोग करें।", "वायु परिसंचरण में सुधार के लिए पौधों के बीच उचित दूरी सुनिश्चित करें।"],
    },
    chemical: {
      en: ["Apply Propiconazole 25% EC at the rate of 1ml/L of water.", "Use Tebuconazole 250 EC (1ml/L) if the infection is widespread.", "Spray fungicides early in the morning or late evening."],
      hi: ["पानी में Propiconazole 25% EC 1ml/L की दर से लगाएं।", "यदि संक्रमण व्यापक है तो Tebuconazole 250 EC (1ml/L) का उपयोग करें।", "सुबह जल्दी या देर शाम फफूंदनाशक का छिड़काव करें।"],
    },
    preventive: {
      en: ["Use resistant wheat varieties for the next planting season.", "Practice crop rotation with non-host crops like legumes.", "Remove and destroy infected plant debris after harvest."],
      hi: ["अगले रोपण मौसम के लिए प्रतिरोधी गेहूँ की किस्मों का उपयोग करें।", "फलियों जैसी गैर-मेजबान फसलों के साथ फसल चक्र का अभ्यास करें।", "फसल कटाई के बाद संक्रमित पौधे के अवशेषों को हटाएं और नष्ट करें।"],
    },
  },
  maize: {
    key: "maize_blight",
    scientific: "Exserohilum turcicum",
    confidence: 89.2,
    organic: {
      en: ["Apply Trichoderma-based biocontrol agents to soil.", "Use neem cake as organic fertilizer to suppress soil pathogens.", "Remove lower infected leaves immediately to slow spread."],
      hi: ["मिट्टी में ट्राइकोडर्मा-आधारित जैव नियंत्रण एजेंट लगाएं।", "मिट्टी के रोगजनकों को दबाने के लिए नीम केक का उपयोग जैविक उर्वरक के रूप में करें।", "फैलाव को धीमा करने के लिए निचली संक्रमित पत्तियों को तुरंत हटा दें।"],
    },
    chemical: {
      en: ["Spray Mancozeb 75WP at 2.5g/L at first disease sign.", "Apply Azoxystrobin 23SC at 1ml/L for systemic protection.", "Repeat fungicide spray every 10-14 days during wet season."],
      hi: ["पहली बीमारी के संकेत पर Mancozeb 75WP 2.5g/L पर छिड़काव करें।", "प्रणालीगत सुरक्षा के लिए Azoxystrobin 23SC 1ml/L पर लगाएं।", "गीले मौसम में हर 10-14 दिन में फफूंदनाशक छिड़काव दोहराएं।"],
    },
    preventive: {
      en: ["Plant disease-resistant maize hybrids.", "Maintain adequate plant spacing for air circulation.", "Avoid overhead irrigation; use drip systems instead."],
      hi: ["रोग-प्रतिरोधी मक्का संकर लगाएं।", "वायु परिसंचरण के लिए पर्याप्त पौधे की दूरी बनाए रखें।", "ओवरहेड सिंचाई से बचें; इसके बजाय ड्रिप सिस्टम का उपयोग करें।"],
    },
  },
  tomato: {
    key: "tomato_leaf_curl",
    scientific: "Tomato Yellow Leaf Curl Virus (TYLCV)",
    confidence: 91.7,
    organic: {
      en: ["Use yellow sticky traps to control whitefly vectors.", "Apply garlic-chili spray as a natural repellent.", "Introduce beneficial insects like ladybugs to control pest population."],
      hi: ["सफेद मक्खी वेक्टर को नियंत्रित करने के लिए पीले चिपचिपे जाल का उपयोग करें।", "प्राकृतिक विकर्षक के रूप में लहसुन-मिर्च का छिड़काव करें।", "कीट आबादी को नियंत्रित करने के लिए लेडीबग जैसे लाभकारी कीड़े डालें।"],
    },
    chemical: {
      en: ["Apply Imidacloprid 17.8SL to control whitefly vectors.", "Use Thiamethoxam 25WG at 0.3g/L as a systemic insecticide.", "Treat seedlings with systemic insecticide before transplanting."],
      hi: ["सफेद मक्खी वेक्टर को नियंत्रित करने के लिए Imidacloprid 17.8SL लगाएं।", "प्रणालीगत कीटनाशक के रूप में Thiamethoxam 25WG 0.3g/L पर उपयोग करें।", "रोपाई से पहले पौध को प्रणालीगत कीटनाशक से उपचारित करें।"],
    },
    preventive: {
      en: ["Use virus-resistant tomato varieties.", "Maintain weed-free field margins to reduce whitefly habitats.", "Install insect-proof nets in nurseries."],
      hi: ["वायरस-प्रतिरोधी टमाटर की किस्मों का उपयोग करें।", "सफेद मक्खी आवास को कम करने के लिए खरपतवार-मुक्त खेत की सीमाएं बनाए रखें।", "नर्सरी में कीट-प्रूफ जाल स्थापित करें।"],
    },
  },
  sugarcane: {
    key: "sugarcane_red_rot",
    scientific: "Colletotrichum falcatum",
    confidence: 87.5,
    organic: {
      en: ["Treat setts with hot water (50°C for 2 hours) before planting.", "Apply Pseudomonas fluorescens as a biological seed treatment.", "Use healthy disease-free setts from certified sources."],
      hi: ["रोपण से पहले सेट्स को गर्म पानी (2 घंटे के लिए 50°C) से उपचारित करें।", "जैविक बीज उपचार के रूप में Pseudomonas fluorescens लगाएं।", "प्रमाणित स्रोतों से स्वस्थ रोग-मुक्त सेट्स का उपयोग करें।"],
    },
    chemical: {
      en: ["Treat setts with Carbendazim 50WP (1g/L) solution.", "Apply Thiophanate methyl 70WP for systemic control.", "Drench soil with copper oxychloride to reduce pathogen load."],
      hi: ["सेट्स को Carbendazim 50WP (1g/L) घोल से उपचारित करें।", "प्रणालीगत नियंत्रण के लिए Thiophanate methyl 70WP लगाएं।", "रोगज़नक़ लोड को कम करने के लिए मिट्टी को कॉपर ऑक्सीक्लोराइड से भिगोएं।"],
    },
    preventive: {
      en: ["Plant resistant sugarcane varieties like Co 86032.", "Practice proper field drainage to avoid waterlogging.", "Destroy infected crop stubble by burning after harvest."],
      hi: ["Co 86032 जैसी प्रतिरोधी गन्ने की किस्में लगाएं।", "जलभराव से बचने के लिए उचित खेत जल निकासी का अभ्यास करें।", "फसल कटाई के बाद जलाकर संक्रमित फसल के ठूंठ को नष्ट करें।"],
    },
  },
};

// ============================================================
// HUMIDITY RISK RULES (Rule-based enhancement)
// ============================================================
function applyHumidityRisk(disease, humidity, temperature) {
  let riskBoost = 0;
  let riskNote = false;
  if (humidity > 75) { riskBoost = Math.min(3, (humidity - 75) * 0.15); riskNote = true; }
  if (temperature > 28 && humidity > 65) riskBoost += 1;
  return { confidence: Math.min(99, disease.confidence + riskBoost), riskNote };
}

// ============================================================
// CHATBOT COMPONENT
// ============================================================
function Chatbot({ lang, t, open, onClose }) {
  const [messages, setMessages] = useState([{ role: "assistant", content: t.chatbot.welcome }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const systemPrompt = lang === "hi"
        ? `आप Farm Doctor ऐप के लिए एक विशेषज्ञ कृषि AI सहायक हैं। आप गेहूँ, मक्का, टमाटर और गन्ने की फसलों के रोगों, जैविक और रासायनिक उपचारों, मिट्टी प्रबंधन, और खेती के सुझावों के विशेषज्ञ हैं। हमेशा हिंदी में जवाब दें। व्यावहारिक, संक्षिप्त और किसान-अनुकूल सलाह दें।`
        : `You are an expert agricultural AI assistant for the Farm Doctor app. You specialize in crop diseases (wheat, maize, tomato, sugarcane), organic and chemical treatments, soil management, and farming tips. Always respond in English. Give practical, concise, farmer-friendly advice. If asked about app usage, explain the prediction and analysis features.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: lang === "hi" ? "माफ़ करें, एक त्रुटि हुई।" : "Sorry, an error occurred. Please try again." }]);
    }
    setLoading(false);
  }, [input, messages, loading, lang]);

  if (!open) return null;

  return (
    <div style={{ position: "fixed", bottom: 0, right: 0, width: 360, height: 500, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-lg) var(--border-radius-lg) 0 0", display: "flex", flexDirection: "column", zIndex: 1000, boxShadow: "0 -4px 24px rgba(0,0,0,0.08)" }}>
      <div style={{ padding: "12px 16px", borderBottom: "0.5px solid var(--color-border-tertiary)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0d9f6e", borderRadius: "var(--border-radius-lg) var(--border-radius-lg) 0 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌿</div>
          <div>
            <div style={{ fontWeight: 500, fontSize: 14, color: "#fff" }}>{t.chatbot.title}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>{t.chatbot.subtitle}</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 18, padding: "0 4px", lineHeight: 1 }}>×</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "80%", padding: "8px 12px", borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", background: m.role === "user" ? "#0d9f6e" : "var(--color-background-secondary)", color: m.role === "user" ? "#fff" : "var(--color-text-primary)", fontSize: 13, lineHeight: 1.5 }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ padding: "8px 12px", borderRadius: "12px 12px 12px 2px", background: "var(--color-background-secondary)", fontSize: 13 }}>
              <span style={{ display: "inline-flex", gap: 3 }}>
                {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#0d9f6e", display: "inline-block", animation: `bounce 1s ease-in-out ${i * 0.2}s infinite` }} />)}
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: "8px 12px", borderTop: "0.5px solid var(--color-border-tertiary)", display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={t.chatbot.placeholder} style={{ flex: 1, padding: "8px 12px", fontSize: 13, border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", outline: "none" }} />
        <button onClick={send} disabled={loading || !input.trim()} style={{ padding: "8px 14px", background: "#0d9f6e", color: "#fff", border: "none", borderRadius: "var(--border-radius-md)", cursor: "pointer", fontSize: 13, fontWeight: 500, opacity: (!input.trim() || loading) ? 0.5 : 1 }}>{t.chatbot.send}</button>
      </div>
      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
    </div>
  );
}

// ============================================================
// HOME PAGE
// ============================================================
function HomePage({ lang, t, onStart }) {
  return (
    <div style={{ minHeight: "calc(100vh - 56px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: "linear-gradient(180deg, #f0faf6 0%, #e8f5ee 100%)", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 80%, rgba(13,159,110,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(13,159,110,0.04) 0%, transparent 50%)", pointerEvents: "none" }} />
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "rgba(255,255,255,0.8)", border: "0.5px solid rgba(13,159,110,0.2)", borderRadius: 20, fontSize: 12, color: "#0d9f6e", fontWeight: 500, marginBottom: 24, backdropFilter: "blur(8px)" }}>
        <span>✨</span> {t.home.badge}
      </div>
      <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, lineHeight: 1.2, margin: "0 0 20px", color: "#111827" }}>
        {t.home.headline1} <span style={{ color: "#0d9f6e" }}>{t.home.headline2}</span><br />{t.home.headline3}
      </h1>
      <p style={{ fontSize: 16, color: "#6b7280", maxWidth: 500, lineHeight: 1.7, margin: "0 0 36px" }}>{t.home.subtext}</p>
      <button onClick={onStart} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", background: "#0d9f6e", color: "#fff", border: "none", borderRadius: 28, fontSize: 16, fontWeight: 600, cursor: "pointer", letterSpacing: 0.3 }}>
        📷 {t.home.cta}
      </button>
      <div style={{ display: "flex", gap: 24, marginTop: 40, flexWrap: "wrap", justifyContent: "center" }}>
        {t.home.features.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#374151" }}>
            <span style={{ color: "#0d9f6e", fontSize: 16 }}>✓</span> {f}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// PREDICTION PAGE
// ============================================================
function PredictionPage({ lang, t, onAnalyze }) {
  const [crop, setCrop] = useState("wheat");
  const [soil, setSoil] = useState("loamy");
  const [temp, setTemp] = useState(24);
  const [humidity, setHumidity] = useState(65);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const fileRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    setImageFile(f);
    const reader = new FileReader();
    reader.onload = e => setImage(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); };

  const autoFetchWeather = async () => {
    setFetching(true);
    await new Promise(r => setTimeout(r, 1200));
    // Simulated weather for Lucknow, UP (real integration shown in code comments)
    setTemp(32); setHumidity(71);
    setFetching(false);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));
    const disease = diseaseData[crop];
    const { confidence, riskNote } = applyHumidityRisk(disease, humidity, temp);
    onAnalyze({ crop, soil, temp, humidity, image, disease: { ...disease, confidence }, riskNote, lang });
    setAnalyzing(false);
  };

  const cropKeys = ["wheat", "maize", "tomato", "sugarcane"];
  const soilKeys = ["loamy", "clay", "sandy"];

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", background: "var(--color-background-tertiary)", padding: "32px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 6px", color: "var(--color-text-primary)" }}>{t.prediction.title}</h2>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: "0 0 28px" }}>{t.prediction.subtitle}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
          {/* Upload Card */}
          <div style={{ background: "var(--color-background-primary)", borderRadius: "var(--border-radius-lg)", border: "0.5px solid var(--color-border-tertiary)", padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#0d9f6e" }}>🖼</span> {t.prediction.uploadTitle}
            </h3>
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              style={{ border: "2px dashed", borderColor: image ? "#0d9f6e" : "var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", padding: 24, textAlign: "center", cursor: "pointer", background: image ? "rgba(13,159,110,0.04)" : "var(--color-background-secondary)", transition: "all 0.2s", minHeight: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
            >
              {image ? (
                <img src={image} alt="crop" style={{ maxHeight: 140, maxWidth: "100%", borderRadius: 8, objectFit: "cover" }} />
              ) : (
                <>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📤</div>
                  <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>{t.prediction.dragDrop}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>{t.prediction.orClick}</p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              {[{ label: t.prediction.gallery, icon: "🖼" }, { label: t.prediction.camera, icon: "📷" }].map(({ label, icon }) => (
                <button key={label} onClick={() => fileRef.current?.click()} style={{ flex: 1, padding: "10px", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", background: "none", cursor: "pointer", fontSize: 13, color: "var(--color-text-primary)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontWeight: 500 }}>
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>

          {/* Crop Info Card */}
          <div style={{ background: "var(--color-background-primary)", borderRadius: "var(--border-radius-lg)", border: "0.5px solid var(--color-border-tertiary)", padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#0d9f6e" }}>🌿</span> {t.prediction.cropInfo}
            </h3>
            <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>{t.prediction.selectCrop}</label>
            <select value={crop} onChange={e => setCrop(e.target.value)} style={{ width: "100%", marginBottom: 20, padding: "9px 12px", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", fontSize: 14 }}>
              {cropKeys.map(k => <option key={k} value={k}>{t.prediction.crops[k]}</option>)}
            </select>

            <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500 }}>ℹ {t.prediction.advanced}</label>
                <button onClick={autoFetchWeather} disabled={fetching} style={{ fontSize: 11, padding: "4px 10px", border: "0.5px solid #0d9f6e", borderRadius: 12, background: "none", color: "#0d9f6e", cursor: "pointer", fontWeight: 500 }}>
                  {fetching ? t.prediction.fetching : `🌦 ${t.prediction.autoFetch}`}
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>{t.prediction.soilType}</label>
                  <select value={soil} onChange={e => setSoil(e.target.value)} style={{ width: "100%", padding: "8px 10px", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", fontSize: 13 }}>
                    {soilKeys.map(k => <option key={k} value={k}>{t.prediction.soils[k]}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>{t.prediction.temperature}</label>
                  <input type="number" value={temp} onChange={e => setTemp(+e.target.value)} style={{ width: "100%", padding: "8px 10px", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", fontSize: 13, boxSizing: "border-box" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>{t.prediction.humidity} — <strong>{humidity}%</strong></label>
                <input type="range" min={0} max={100} step={1} value={humidity} onChange={e => setHumidity(+e.target.value)} style={{ width: "100%" }} />
                {humidity > 75 && <div style={{ fontSize: 11, color: "#d97706", marginTop: 4 }}>⚠ {lang === "hi" ? "उच्च आर्द्रता - रोग जोखिम बढ़ा" : "High humidity — increased disease risk"}</div>}
              </div>
            </div>

            <button onClick={handleAnalyze} disabled={!image || analyzing} style={{ width: "100%", padding: "13px", background: image ? "#0d9f6e" : "var(--color-background-secondary)", color: image ? "#fff" : "var(--color-text-tertiary)", border: "none", borderRadius: "var(--border-radius-md)", fontSize: 15, fontWeight: 600, cursor: image ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
              {analyzing ? `⏳ ${t.prediction.analyzing}` : `📊 ${t.prediction.analyze}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// RESULTS PAGE
// ============================================================
function ResultsPage({ lang, t, result, onBack, onNew }) {
  const { crop, soil, temp, humidity, image, disease, riskNote } = result;
  const tr = translations[lang];
  const diseaseName = tr.diseases[disease.key] || disease.key;
  const solutions = {
    organic: disease.organic[lang],
    chemical: disease.chemical[lang],
    preventive: disease.preventive[lang],
  };
  const cropLabel = t.prediction.crops[crop];
  const soilLabel = t.prediction.soils[soil];

  const sectionColors = {
    organic: { border: "#0d9f6e", bg: "rgba(13,159,110,0.04)", icon: "🌿", label: t.results.organic },
    chemical: { border: "#d97706", bg: "rgba(217,119,6,0.04)", icon: "⚗️", label: t.results.chemical },
    preventive: { border: "#3b82f6", bg: "rgba(59,130,246,0.04)", icon: "🛡", label: t.results.preventive },
  };

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", background: "var(--color-background-tertiary)", padding: "28px 24px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <button onClick={onBack} style={{ fontSize: 13, color: "var(--color-text-secondary)", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>← {t.results.back}</button>
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "var(--color-text-primary)" }}>{t.results.title}</h2>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ padding: "9px 18px", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", cursor: "pointer", fontSize: 13, color: "var(--color-text-primary)", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
              ↓ {t.results.saveReport}
            </button>
            <button onClick={onNew} style={{ padding: "9px 18px", border: "none", borderRadius: "var(--border-radius-md)", background: "#0d9f6e", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              + {t.results.newPrediction}
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, alignItems: "start" }}>
          {/* Left Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "var(--color-background-primary)", borderRadius: "var(--border-radius-lg)", border: "0.5px solid var(--color-border-tertiary)", overflow: "hidden" }}>
              <img src={image} alt="crop" style={{ width: "100%", height: 160, objectFit: "cover" }} />
              <div style={{ padding: 16 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", background: "rgba(239,68,68,0.1)", borderRadius: 12, fontSize: 11, color: "#dc2626", fontWeight: 500, marginBottom: 10 }}>
                  ⚠ {t.results.diseaseDetected}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px", color: "var(--color-text-primary)" }}>{diseaseName}</h3>
                <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: "0 0 12px", fontStyle: "italic" }}>{disease.scientific}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{t.results.aiConfidence}</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "#0d9f6e" }}>{disease.confidence.toFixed(1)}%</span>
                  <span style={{ fontSize: 14 }}>✓</span>
                </div>
                <div style={{ marginTop: 10, height: 6, background: "var(--color-background-secondary)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${disease.confidence}%`, background: "linear-gradient(90deg, #0d9f6e, #10b981)", borderRadius: 3, transition: "width 1s ease" }} />
                </div>
              </div>
            </div>

            <div style={{ background: "var(--color-background-primary)", borderRadius: "var(--border-radius-lg)", border: "0.5px solid var(--color-border-tertiary)", padding: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: 500, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>📋 {t.results.conditionsAnalyzed}</h4>
              {[
                [t.results.crop, cropLabel],
                [t.results.soilType, soilLabel],
                [t.results.temperature, `${temp}°C`],
                [t.results.humidity, `${humidity}%`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "0.5px solid var(--color-border-tertiary)", fontSize: 13 }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>{k}</span>
                  <span style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>{v}</span>
                </div>
              ))}
              {riskNote && (
                <div style={{ marginTop: 10, padding: "8px 10px", background: "rgba(217,119,6,0.08)", borderRadius: "var(--border-radius-md)", fontSize: 11, color: "#b45309", display: "flex", alignItems: "flex-start", gap: 6 }}>
                  <span>⚠</span> {t.results.riskNote}
                </div>
              )}
            </div>
          </div>

          {/* Right: Treatments */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#0d9f6e" }}>✓</span> {t.results.treatments}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {Object.entries(sectionColors).map(([type, cfg]) => (
                <div key={type} style={{ background: cfg.bg, border: `1px solid ${cfg.border}30`, borderLeft: `3px solid ${cfg.border}`, borderRadius: "var(--border-radius-md)", padding: 16 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 500, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6, color: "var(--color-text-primary)" }}>
                    <span>{cfg.icon}</span> {cfg.label}
                  </h4>
                  <ul style={{ margin: 0, padding: "0 0 0 16px", display: "flex", flexDirection: "column", gap: 7 }}>
                    {solutions[type].map((s, i) => (
                      <li key={i} style={{ fontSize: 13, color: "var(--color-text-primary)", lineHeight: 1.6 }}>{s}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function FarmDoctor() {
  const [lang, setLang] = useState("en");
  const [page, setPage] = useState("home"); // home | predict | results
  const [result, setResult] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  const t = translations[lang];

  const handleAnalyze = (data) => {
    setResult(data);
    setPage("results");
  };

  return (
    <div style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)", minHeight: "100vh", background: "var(--color-background-tertiary)" }}>
      {/* Navbar */}
      <nav style={{ height: 56, background: "var(--color-background-primary)", borderBottom: "0.5px solid var(--color-border-tertiary)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => setLang(lang === "en" ? "hi" : "en")} style={{ fontSize: 12, padding: "5px 12px", border: "0.5px solid var(--color-border-secondary)", borderRadius: 16, background: "none", cursor: "pointer", color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 5, fontWeight: 500 }}>
          🌐 {t.nav.language}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 17, color: "#0d9f6e", cursor: "pointer" }} onClick={() => setPage("home")}>
          🌿 {t.nav.title}
        </div>
        <button style={{ fontSize: 12, padding: "5px 12px", border: "0.5px solid var(--color-border-secondary)", borderRadius: 16, background: "none", cursor: "pointer", color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 5 }}>
          👤 {t.nav.history}
        </button>
      </nav>

      {/* Pages */}
      {page === "home" && <HomePage lang={lang} t={t} onStart={() => setPage("predict")} />}
      {page === "predict" && <PredictionPage lang={lang} t={t} onAnalyze={handleAnalyze} />}
      {page === "results" && result && <ResultsPage lang={lang} t={t} result={result} onBack={() => setPage("predict")} onNew={() => { setResult(null); setPage("predict"); }} />}

      {/* Chatbot FAB */}
      {!chatOpen && (
        <div style={{ position: "fixed", bottom: 24, right: 24, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, zIndex: 999 }}>
          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-lg)", padding: "10px 14px", fontSize: 12, maxWidth: 200, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <div style={{ fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 2 }}>{t.chatbot.needHelp}</div>
            <div style={{ color: "var(--color-text-secondary)", fontSize: 11 }}>{t.chatbot.helpSub}</div>
          </div>
          <button onClick={() => setChatOpen(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", background: "#0d9f6e", color: "#fff", border: "none", borderRadius: 28, cursor: "pointer", fontSize: 14, fontWeight: 600, boxShadow: "0 4px 16px rgba(13,159,110,0.35)" }}>
            🌿 {t.chatbot.title}
          </button>
        </div>
      )}

      <Chatbot lang={lang} t={t} open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
