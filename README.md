# 🌾 Farm Doctor – AI Crop Disease Detection System

Farm Doctor is a full-stack AI application that detects crop diseases from leaf images using deep learning.

---

## 🚀 Features

* 🌿 Multi-crop support

  * Maize
  * Tomato
  * Wheat
  * Sugarcane

* 🧠 Deep Learning Models (MobileNetV2,EfficientNetB0)

* ⚡ Fast predictions using Flask API

* 📱 React frontend for user interaction

* 🎯 Confidence-based prediction system

---

## 🧱 Project Structure

```
Farm-Doctor/
│
├── backend/
│    ├── app.py              ✅ (API)
│    ├── predict.py          ✅ (core inference)
│    ├── train.py            ✅ (training)
│    ├── sugarcane_model.py  ✅ (specific for sugarcane train)
│    ├── data_loader.py      ✅ (final loader)
│    ├── fixed_data_loader.py✅ (sugarcane loader)
│    ├── clean.py            ✅ (dataset cleaning)
│    ├── split.py            ✅ (dividing dataset into train/test/validate)
│    ├── balance.py          ✅ (check the sample is each class)
│
├── models/
│   ├── maize_model.tflite
│   ├── tomato_model.tflite
│   ├── wheat_model.tflite
│   ├── sugarcane_model.tflite
│   ├── maize_model.keras
│   ├── tomato_model.keras
│   ├── wheat_model.keras
│   ├── sugarcane_model.keras
│
├── farm-doctor-frontend/
│   ├── src/
│   ├── package.json
│
├── requirements.txt
├── README.md
└── .gitignore
```

---

## 🧠 How It Works

1. User selects a crop
2. Uploads a leaf image
3. Backend loads the corresponding model
4. Model predicts disease
5. Result is returned with confidence score

---

## ⚙️ Installation

### 🔹 Backend Setup

```
cd backend
python -m venv venv                  -- create virtual environment 
venv\Scripts\activate                -- activate virtual environment 
pip install -r ../requirements.txt   -- download requirments 
python app.py                        -- run app 
```

---

### 🔹 Frontend Setup

```
cd farm-doctor-frontend
npm install
npm start
```

---

## 🌐 API Endpoint

### POST `/predict`

**Form Data:**

| Key   | Type | Description                        |
| ----- | ---- | ---------------------------------- |
| crop  | Text | maize / tomato / wheat / sugarcane |
| image | File | Leaf image                         |

---

## 📊 Example Response

```
{
  "prediction": "rust",
  "confidence": 0.87
}
```

---

## ⚠️ Limitations

* Sugarcane disease detection is challenging due to subtle patterns
* Accuracy depends on image quality
* Low-confidence images are marked as "Uncertain"

---

## 🔮 Future Improvements

* 🤖 AI Chatbot integration
* 🌦️ Weather & soil-based prediction
* 📱 Mobile app (TFLite deployment)
* 🌍 Multi-language support

---



---

## ⭐ Contribute

Feel free to fork this repo and improve the system 🚀
