import tensorflow as tf
import numpy as np
from PIL import Image
import os

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

    # Use correct size
    img_size = IMG_SIZES[crop]

    img = Image.open(image_path).convert("RGB").resize(img_size)
    img = np.array(img)

    # Use correct preprocessing
    img = PREPROCESS[crop](img)

    img = np.expand_dims(img, axis=0)

    preds = model.predict(img)
    confidence = float(np.max(preds))
    class_index = int(np.argmax(preds))

    if confidence < 0.6:
        return {
            "prediction": "Uncertain / Invalid image",
            "confidence": confidence
        }

    return {
        "prediction": class_names[class_index],
        "confidence": confidence
    }