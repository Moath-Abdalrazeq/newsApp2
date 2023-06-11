import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Keyboard,
  StyleSheet
} from "react-native";
import ImagePicker from "react-native-image-picker";
import firebase from "../../config";
import "firebase/auth";
import "firebase/firestore";
import * as Location from 'expo-location';

const AddNews = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUri, setMediaUri] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleSubmit = async () => {
    if (!location) {
      Alert.alert("Location not available.");
      return;
    }

    const currentUser = firebase.auth().currentUser;
    const usersRef = firebase.firestore().collection("users").doc(currentUser.uid);
    const doc = await usersRef.get();

    if (!doc.exists) {
      Alert.alert("User not found.");
      return;
    }

    const userRole = doc.data().role;
    let initialStatus = userRole === "journalist" ? "accepted" : "pending";

    const newsRef = firebase.firestore().collection("news");
    const newNews = {
      title: title,
      description: description,
      mediaUri: mediaUri,
      location: new firebase.firestore.GeoPoint(location.coords.latitude, location.coords.longitude),
      status: initialStatus // Set the initial status based on user role
    };

    newsRef
      .add(newNews)
      .then(() => {
        setTitle("");
        setDescription("");
        setMediaUri(null);
        Alert.alert("News added successfully!");
      })
      .catch((error) => {
        Alert.alert("Error adding news: " + error);
      });
  };

  const handleUploadMedia = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access media library is required!");
      return;
    }

    const options = {
      mediaType: "mixed",
      quality: 1,
      allowsEditing: true,
      videoQuality: "medium",
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        return;
      } else if (response.error) {
        Alert.alert("Error: " + response.error);
        return;
      } else if (response.assets.length > 0) {
        const selectedAsset = response.assets[0];
        setMediaUri(selectedAsset.uri);
      }
    });
  };

  return (
    <View style={styles.container} onPress={() => Keyboard.dismiss()}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        value={description}
        onChangeText={(text) => setDescription(text)}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.button} onPress={handleUploadMedia}>
        <Text style={styles.buttonText}>Upload Media</Text>
      </TouchableOpacity>
      {mediaUri ? (
        mediaUri.endsWith(".mov") ? (
          <Video source={{ uri: mediaUri }} style={styles.media} resizeMode="contain" />
        ) : (
          <Image source={{ uri: mediaUri }} style={styles.media} resizeMode="contain" />
        )
      ) : null}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add News</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007aff",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  media: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
});

export default AddNews;
