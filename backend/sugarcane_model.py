import tensorflow as tf
from fixed_data_loader import load_data
import os
import numpy as np
from sklearn.metrics import classification_report

# 🔥 CONFIG
IMG_SIZE = (256, 256)
DATA_PATH = "data/processed/sugarcane"
BATCH_SIZE = 32

# Load data (make sure your loader resizes to IMG_SIZE)
train, val, test = load_data(DATA_PATH, img_size=IMG_SIZE, batch_size=BATCH_SIZE)

class_names = train.class_names
NUM_CLASSES = len(class_names)

print("Classes:", class_names)
print("Number of classes:", NUM_CLASSES)

AUTOTUNE = tf.data.AUTOTUNE

# ✅ Correct preprocessing for EfficientNet
preprocess_input = tf.keras.applications.efficientnet.preprocess_input

train = train.map(lambda x, y: (preprocess_input(x), y), num_parallel_calls=AUTOTUNE)
val = val.map(lambda x, y: (preprocess_input(x), y), num_parallel_calls=AUTOTUNE)
test = test.map(lambda x, y: (preprocess_input(x), y), num_parallel_calls=AUTOTUNE)

train = train.prefetch(AUTOTUNE)
val = val.prefetch(AUTOTUNE)
test = test.prefetch(AUTOTUNE)

# 🔥 Strong Augmentation (based on your dataset issues)
data_augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomFlip("horizontal"),
    tf.keras.layers.RandomRotation(0.25),
    tf.keras.layers.RandomZoom(0.3),
    tf.keras.layers.RandomTranslation(0.2, 0.2),
    tf.keras.layers.RandomContrast(0.3),
])

# 🔥 EfficientNet Model
base_model = tf.keras.applications.EfficientNetB0(
    input_shape=(256, 256, 3),
    include_top=False,
    weights='imagenet'
)

# 🔥 Fine-tuning strategy
base_model.trainable = True

for layer in base_model.layers[:100]:
    layer.trainable = False

# Model
inputs = tf.keras.Input(shape=(256, 256, 3))
x = data_augmentation(inputs)
x = base_model(x, training=False)

x = tf.keras.layers.GlobalAveragePooling2D()(x)
x = tf.keras.layers.BatchNormalization()(x)
x = tf.keras.layers.Dense(256, activation='relu')(x)
x = tf.keras.layers.Dropout(0.4)(x)

outputs = tf.keras.layers.Dense(NUM_CLASSES, activation='softmax')(x)

model = tf.keras.Model(inputs, outputs)

# Compile
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()

# 🔥 Callbacks
callbacks = [
    tf.keras.callbacks.EarlyStopping(patience=6, restore_best_weights=True),
    tf.keras.callbacks.ReduceLROnPlateau(patience=3, factor=0.3),
]

# 🚀 Train
history = model.fit(
    train,
    validation_data=val,
    epochs=25,
    callbacks=callbacks
)

# 📊 Evaluate
test_loss, test_acc = model.evaluate(test)

print("\n📊 FINAL RESULTS")
print("Train Accuracy:", history.history['accuracy'][-1])
print("Validation Accuracy:", history.history['val_accuracy'][-1])
print("Test Accuracy:", test_acc)
print("Best Validation Accuracy:", max(history.history['val_accuracy']))

# 🔥 Classification Report
y_true = []
y_pred = []

for images, labels in test:
    preds = model.predict(images)
    y_true.extend(labels.numpy())
    y_pred.extend(np.argmax(preds, axis=1))

print("\n📊 Classification Report:\n")
print(classification_report(y_true, y_pred, target_names=class_names))

# 💾 Save model
os.makedirs("models", exist_ok=True)
model.save("models/sugarcane_model.keras")

# 📱 Convert to TFLite (mobile deployment)
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]

tflite_model = converter.convert()

with open("models/sugarcane_model.tflite", "wb") as f:
    f.write(tflite_model)

print("\n✅ TFLite model saved!")