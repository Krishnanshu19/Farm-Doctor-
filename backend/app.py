from flask import Flask, request, jsonify
from flask_cors import CORS
from predict import predict
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/")
def home():
    return "🌾 Farm Doctor API Running"


@app.route("/predict", methods=["POST"])
def predict_api():
    try:
        crop = request.form.get("crop")
        file = request.files.get("image")

        if not crop or not file:
            return jsonify({"error": "Missing crop or image"}), 400

        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        result = predict(crop, filepath)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)