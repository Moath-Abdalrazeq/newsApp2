import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Modal, TextInput, Button } from "react-native";
import ImagePicker from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import firebase from "../../config";

const JournalistProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [newProfileImage, setNewProfileImage] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userId = firebase.auth().currentUser.uid;
      const userSnapshot = await firebase.firestore().collection("users").doc(userId).get();

      if (userSnapshot.exists) {
        setUser(userSnapshot.data());
        setLoading(false);
      }
    } catch (error) {
      console.log("Error fetching user profile:", error);
    }
  };

  const handleEditBio = () => {
    setEditModalVisible(true);
    setNewBio(user.bio || "");
  };

  const handleEditProfileImage = () => {
    setEditModalVisible(true);
  };

  const handleChooseImage = async () => {
    Geolocation.requestAuthorization('whenInUse');
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.didCancel === false) {
      setNewProfileImage(result.uri);
    }
  };

  const saveBio = async () => {
    try {
      const userId = firebase.auth().currentUser.uid;
      await firebase.firestore().collection("users").doc(userId).update({ bio: newBio });
      setEditModalVisible(false);
      setUser({ ...user, bio: newBio });
    } catch (error) {
      console.log("Error updating bio:", error);
    }
  };

  const saveProfileImage = async () => {
    try {
      if (newProfileImage) {
        const userId = firebase.auth().currentUser.uid;
        const response = await fetch(newProfileImage);
        const blob = await response.blob();
        const imageRef = firebase.storage().ref().child(`profileImages/${userId}`);
        await imageRef.put(blob);

        const downloadURL = await imageRef.getDownloadURL();
        await firebase.firestore().collection("users").doc(userId).update({ profilePicture: downloadURL });

        setEditModalVisible(false);
        setUser({ ...user, profilePicture: downloadURL });
      }
    } catch (error) {
      console.log("Error updating profile image:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={handleEditProfileImage}>
          <Image source={{ uri: user.profilePicture || "https://via.placeholder.com/150" }} style={styles.profilePicture} />
        </TouchableOpacity>
        <Text style={styles.profileName}>{user.firstName} {user.lastName}</Text>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.text}>{user.email}</Text>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Bio:</Text>
        {user.bio ? (
          <Text style={styles.text}>{user.bio}</Text>
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={handleEditBio}>
            <Text style={styles.addButtonText}>Add Bio</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Edit Bio/Profile Image Modal */}
      <Modal visible={editModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          {user.bio && (
            <>
              <Text style={styles.modalHeading}>Edit Bio</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your bio"
                value={newBio}
                onChangeText={setNewBio}
              />
              <Button title="Save" onPress={saveBio} />
            </>
          )}
          {!user.bio && (
            <>
              <Text style={styles.modalHeading}>Add Bio</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your bio"
                value={newBio}
                onChangeText={setNewBio}
              />
              <Button title="Save" onPress={saveBio} />
            </>
          )}
          {!user.profilePicture && (
            <>
              <Text style={styles.modalHeading}>Add Profile Image</Text>
              <Button title="Choose Image" onPress={handleChooseImage} />
              <Button title="Save" onPress={saveProfileImage} />
            </>
          )}
          {newProfileImage && (
            <Image source={{ uri: newProfileImage }} style={styles.previewImage} />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default JournalistProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
  },
  profileInfo: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555555",
  },
  text: {
    fontSize: 16,
    color: "#333333",
  },
  addButton: {
    marginTop: 10,
    alignSelf: "flex-start",
  },
  addButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalHeading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#999999",
    borderRadius: 5,
    paddingLeft: 10,
  },
  previewImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});
