import tensorflow as tf

IMG_SIZE = (224, 224)
BATCH_SIZE = 32

def load_data(path):
    train = tf.keras.preprocessing.image_dataset_from_directory(
        path + "/train",
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE
    )

    val = tf.keras.preprocessing.image_dataset_from_directory(
        path + "/val",
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE
    )

    test = tf.keras.preprocessing.image_dataset_from_directory(
        path + "/test",
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE
    )

    return train, val, test


def data_augmentation():
    return tf.keras.Sequential([
        tf.keras.layers.RandomFlip("horizontal"),
        tf.keras.layers.RandomRotation(0.2),
        tf.keras.layers.RandomZoom(0.2),
        tf.keras.layers.RandomBrightness(0.2)
    ])