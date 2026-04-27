import tensorflow as tf
from data_loader import load_data
import os
import numpy as np
from sklearn.metrics import classification_report

IMG_SIZE = (224, 224)
DATA_PATH = "data/processed/wheat"

# Load data
train, val, test = load_data(DATA_PATH)

# ✅ Get class names from dataset
class_names = train.class_names
NUM_CLASSES = len(class_names)

print("Classes:", class_names)
print("Number of classes:", NUM_CLASSES)

AUTOTUNE = tf.data.AUTOTUNE

# ✅ Normalization
normalization = tf.keras.layers.Rescaling(1./255)

train = train.map(lambda x, y: (normalization(x), y), num_parallel_calls=AUTOTUNE)
val = val.map(lambda x, y: (normalization(x), y), num_parallel_calls=AUTOTUNE)
test = test.map(lambda x, y: (normalization(x), y), num_parallel_calls=AUTOTUNE)

# Prefetch
train = train.prefetch(AUTOTUNE)
val = val.prefetch(AUTOTUNE)
test = test.prefetch(AUTOTUNE)

# Data Augmentation
data_augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomFlip("horizontal"),
    tf.keras.layers.RandomRotation(0.1),
    tf.keras.layers.RandomZoom(0.1),
])

# Base Model
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights='imagenet'
)

# Fine-tuning
base_model.trainable = False
for layer in base_model.layers[-20:]:
    layer.trainable = True

# Model
inputs = tf.keras.Input(shape=(224, 224, 3))
x = data_augmentation(inputs)
x = base_model(x, training=False)

x = tf.keras.layers.GlobalAveragePooling2D()(x)
x = tf.keras.layers.BatchNormalization()(x)
x = tf.keras.layers.Dense(128, activation='relu')(x)
x = tf.keras.layers.Dropout(0.3)(x)

outputs = tf.keras.layers.Dense(NUM_CLASSES, activation='softmax')(x)

model = tf.keras.Model(inputs, outputs)

# Compile
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()

# Callbacks
callbacks = [
    tf.keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True),
    tf.keras.callbacks.ReduceLROnPlateau(patience=2, factor=0.3),
]

# Train
history = model.fit(
    train,
    validation_data=val,
    epochs=20,
    callbacks=callbacks
)

# Evaluate
test_loss, test_acc = model.evaluate(test)

# 📊 Print Accuracy
print("\n📊 FINAL RESULTS")
print("Train Accuracy:", history.history['accuracy'][-1])
print("Validation Accuracy:", history.history['val_accuracy'][-1])
print("Test Accuracy:", test_acc)
print("Best Validation Accuracy:", max(history.history['val_accuracy']))

# 🔥 Precision, Recall, F1-score
y_true = []
y_pred = []

for images, labels in test:
    preds = model.predict(images)
    y_true.extend(labels.numpy())
    y_pred.extend(np.argmax(preds, axis=1))

train, val, test = load_data(DATA_PATH)
class_names = train.class_names

print("\n📊 Classification Report:\n")
print(classification_report(y_true, y_pred, target_names=class_names))

# Save model
os.makedirs("models", exist_ok=True)
model.save("models/wheat_model.keras")

# 🔥 Convert to TFLite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]

tflite_model = converter.convert()

with open("models/wheat_model.tflite", "wb") as f:
    f.write(tflite_model)

print("\n✅ TFLite model saved!")