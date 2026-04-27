import tensorflow as tf

def load_data(path, img_size=(256, 256), batch_size=32):

    train = tf.keras.utils.image_dataset_from_directory(
        path + "/train",
        image_size=img_size,
        batch_size=batch_size,
        shuffle=True,
        seed=42
    )

    val = tf.keras.utils.image_dataset_from_directory(
        path + "/val",
        image_size=img_size,
        batch_size=batch_size,
        shuffle=False
    )

    test = tf.keras.utils.image_dataset_from_directory(
        path + "/test",
        image_size=img_size,
        batch_size=batch_size,
        shuffle=False
    )

    return train, val, test