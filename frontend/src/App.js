import React, { useState } from "react";

function App() {
  const [crop, setCrop] = useState("maize");
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("crop", crop);
    formData.append("image", image);

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1>🌾 Farm Doctor</h1>

      <select value={crop} onChange={(e) => setCrop(e.target.value)} style={styles.input}>
        <option value="maize">Maize</option>
        <option value="tomato">Tomato</option>
        <option value="wheat">Wheat</option>
        <option value="sugarcane">Sugarcane</option>
      </select>

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        style={styles.input}
      />

      <button onClick={handleSubmit} style={styles.button}>
        Predict
      </button>

      {loading && <p>⏳ Processing...</p>}

      {result && (
        <div style={styles.result}>
          <h3>Prediction: {result.prediction}</h3>
          <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  input: {
    display: "block",
    margin: "10px auto",
    padding: "10px",
  },
  button: {
    padding: "10px 20px",
    cursor: "pointer",
  },
  result: {
    marginTop: "20px",
    padding: "10px",
    border: "1px solid #ccc",
    display: "inline-block",
  },
};

export default App;