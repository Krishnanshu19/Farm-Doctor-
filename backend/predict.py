import tensorflow as tf
import numpy as np
from PIL import Image
import os

SOLUTIONS = {

# ===================== MAIZE =====================
"maize": {
    "blight": {
        "organic": [
            "Neem oil spray weekly",
            "Remove infected leaves",
            "Use compost tea spray"
        ],
        "chemical": [
            "Apply Copper fungicide",
            "Use Mancozeb",
            "Apply Chlorothalonil"
        ],
        "prevention": [
            "Use resistant varieties",
            "Avoid overhead irrigation",
            "Maintain field sanitation"
        ]
    },

    "leaf_spot": {
        "organic": [
            "Remove infected leaves",
            "Neem oil spray",
            "Use compost extract"
        ],
        "chemical": [
            "Apply Mancozeb",
            "Use Chlorothalonil"
        ],
        "prevention": [
            "Proper spacing",
            "Avoid water splash on leaves"
        ]
    },

    "rust": {
        "organic": [
            "Neem oil spray",
            "Use organic compost",
            "Remove affected leaves"
        ],
        "chemical": [
            "Apply Propiconazole",
            "Use Tebuconazole"
        ],
        "prevention": [
            "Use resistant seeds",
            "Avoid dense planting"
        ]
    },

    "healthy": {
        "organic": ["Maintain soil nutrition"],
        "chemical": ["No treatment needed"],
        "prevention": ["Regular monitoring"]
    }
},

# ===================== TOMATO =====================
"tomato": {
    "bacterial_spot": {
        "organic": [
            "Neem oil spray",
            "Remove infected leaves",
            "Use compost tea"
        ],
        "chemical": [
            "Apply Copper bactericide",
            "Use Streptomycin"
        ],
        "prevention": [
            "Avoid overhead watering",
            "Use disease-free seeds"
        ]
    },

    "early_blight": {
        "organic": [
            "Neem oil spray weekly",
            "Use compost tea",
            "Remove infected leaves"
        ],
        "chemical": [
            "Apply Mancozeb",
            "Use Chlorothalonil",
            "Apply Azoxystrobin"
        ],
        "prevention": [
            "Mulching",
            "Proper spacing"
        ]
    },

    "late_blight": {
        "organic": [
            "Remove infected plants immediately",
            "Improve airflow"
        ],
        "chemical": [
            "Apply Metalaxyl",
            "Use Mancozeb"
        ],
        "prevention": [
            "Avoid humidity",
            "Do not wet leaves frequently"
        ]
    },

    "leaf_mold": {
        "organic": [
            "Improve ventilation",
            "Reduce humidity"
        ],
        "chemical": [
            "Use Chlorothalonil"
        ],
        "prevention": [
            "Avoid overcrowding"
        ]
    },

    "septoria_leaf_spot": {
        "organic": [
            "Remove infected leaves",
            "Neem oil spray"
        ],
        "chemical": [
            "Apply Mancozeb"
        ],
        "prevention": [
            "Avoid splashing water"
        ]
    },

    "healthy": {
        "organic": ["Balanced fertilization"],
        "chemical": ["No treatment needed"],
        "prevention": ["Regular monitoring"]
    }
},

# ===================== WHEAT =====================
"wheat": {
    "brown_rust": {
        "organic": [
            "Neem oil spray",
            "Use compost"
        ],
        "chemical": [
            "Apply Propiconazole",
            "Use Tebuconazole"
        ],
        "prevention": [
            "Resistant varieties",
            "Proper spacing"
        ]
    },

    "yellow_rust": {
        "organic": [
            "Neem oil",
            "Organic compost"
        ],
        "chemical": [
            "Apply Tebuconazole"
        ],
        "prevention": [
            "Early sowing",
            "Resistant seeds"
        ]
    },

    "loose_smut": {
        "organic": [
            "Hot water seed treatment"
        ],
        "chemical": [
            "Treat seeds with Carbendazim"
        ],
        "prevention": [
            "Use certified seeds"
        ]
    },

    "septoria": {
        "organic": [
            "Remove debris",
            "Use compost"
        ],
        "chemical": [
            "Apply Mancozeb"
        ],
        "prevention": [
            "Crop rotation"
        ]
    },

    "healthy": {
        "organic": ["Maintain soil health"],
        "chemical": ["No treatment needed"],
        "prevention": ["Regular monitoring"]
    }
},

# ===================== SUGARCANE =====================
"sugarcane": {
    "mosaic": {
        "organic": [
            "Control aphids using neem oil",
            "Remove infected plants"
        ],
        "chemical": [
            "Apply Imidacloprid"
        ],
        "prevention": [
            "Use disease-free planting material"
        ]
    },

    "red_rot": {
        "organic": [
            "Remove infected canes",
            "Use compost"
        ],
        "chemical": [
            "Apply Carbendazim"
        ],
        "prevention": [
            "Use healthy setts"
        ]
    },

    "rust": {
        "organic": [
            "Neem oil spray",
            "Improve airflow"
        ],
        "chemical": [
            "Apply Propiconazole"
        ],
        "prevention": [
            "Avoid overcrowding"
        ]
    },

    "yellow_leaf": {
        "organic": [
            "Improve soil nutrients",
            "Use organic manure"
        ],
        "chemical": [
            "Apply Dimethoate"
        ],
        "prevention": [
            "Control pests"
        ]
    },

    "healthy": {
        "organic": ["Proper irrigation"],
        "chemical": ["No treatment needed"],
        "prevention": ["Regular monitoring"]
    }
}
}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODELS_PATH = os.path.join(BASE_DIR, "..", "models")

# Load models once (IMPORTANT for speed)
models = {
    "maize": tf.keras.models.load_model(os.path.join(MODELS_PATH, "maize_model.keras")),
    "tomato": tf.keras.models.load_model(os.path.join(MODELS_PATH, "tomato_model.keras")),
    "wheat": tf.keras.models.load_model(os.path.join(MODELS_PATH, "wheat_model.keras")),
    "sugarcane": tf.keras.models.load_model(os.path.join(MODELS_PATH, "sugarcane_model.keras")),
}



# Class names (update based on your datasets)
CLASS_NAMES = {
    "maize": ['blight', 'healthy', 'leaf_spot', 'rust'],
    "tomato": ['bacterial_spot','early_blight','healthy', 'late_blight', 'leaf_mold', 'septoria_leaf_spot'],
    "wheat": ['brown_rust','healthy', 'loose_smut' , 'septoria', 'yellow_rust'],
    "sugarcane": ['healthy', 'mosaic', 'red_rot', 'rust', 'yellow_leaf']
}

PREPROCESS = {
    "maize": lambda x: x / 255.0,
    "tomato": lambda x: x / 255.0,
    "wheat": lambda x: x / 255.0,
    "sugarcane": tf.keras.applications.efficientnet.preprocess_input,
}

IMG_SIZES = {
    "maize": (224, 224),
    "tomato": (224, 224),
    "wheat": (224, 224),
    "sugarcane": (256, 256),
}
def predict(crop, image_path):
    if crop not in models:
        return {"error": "Invalid crop"}

    model = models[crop]
    class_names = CLASS_NAMES[crop]

    img_size = IMG_SIZES[crop]
    img = Image.open(image_path).convert("RGB").resize(img_size)
    img = np.array(img)
    img = PREPROCESS[crop](img)
    img = np.expand_dims(img, axis=0)

    preds = model.predict(img)
    confidence = float(np.max(preds))
    class_index = int(np.argmax(preds))

    # ✅ label defined BEFORE it's used
    label = class_names[class_index]
    solution = SOLUTIONS.get(crop, {}).get(label, {})

    if confidence < 0.4:
        return {
            "prediction": "Uncertain / Invalid image",
            "confidence": confidence,
            "organic_solutions": solution.get("organic", ["No data available"]),
            "chemical_solutions": solution.get("chemical", ["No data available"]),
            "prevention": solution.get("prevention", ["No data available"])
        }

    return {
        "prediction": label,
        "confidence": confidence,
        "organic_solutions": solution.get("organic", ["No data available"]),
        "chemical_solutions": solution.get("chemical", ["No data available"]),
        "prevention": solution.get("prevention", ["No data available"])
    }