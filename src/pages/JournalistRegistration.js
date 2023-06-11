import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { firebase } from "../../config";
import DocumentPicker from 'react-native-document-picker';

const JournalistRegistration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [organization, setOrganization] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      if (!result.cancelled) {
        const filename = getFilenameFromUri(result.uri);
        setSelectedFile({ uri: result.uri, filename });
      }
    } catch (error) {
      console.log('Error picking document:', error);
    }
  };

  const registerJournalist = async () => {
    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      const status = "pending";

      await firebase
        .firestore()
        .collection("users")
        .doc(userCredential.user.uid)
        .set({
          firstName,
          lastName,
          email,
          city,
          organization,
          role: "journalist",
          status,
          cv: selectedFile ? selectedFile.uri : null,
        });

      alert(
        "Please wait for the admin to send an acceptance message to your email."
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const getFilenameFromUri = (uri) => {
    if (!uri) return "";
    const path = uri.split("/");
    const filename = path[path.length - 1];
    return decodeURI(filename);
  };

  const getFilename = () => {
    if (selectedFile) {
      return selectedFile.filename;
    }
    return "";
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeAreaView}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.content}
        >
          <View style={styles.root}>
            <View style={styles.container}>
              <Text style={{ fontWeight: "bold", fontSize: 23 }}>
                Journalist Sign Up
              </Text>
              <View style={{ marginTop: 40 }}>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  onChangeText={setFirstName}
                  autoCorrect={false}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  onChangeText={setLastName}
                  autoCorrect={false}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  onChangeText={setEmail}
                  autoCorrect={false}
                  keyboardType="email-address"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={true}
                />
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  onChangeText={setCity}
                  autoCorrect={false}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Organization"
                  onChangeText={setOrganization}
                  autoCorrect={false}
                />
              </View>
              <View style={styles.uploadSection}>
                <Text style={styles.uploadLabel}>Upload CV</Text>
                <TouchableOpacity onPress={pickDocument} style={styles.uploadButton}>
                  <Text style={styles.uploadButtonText}>Choose PDF</Text>
                </TouchableOpacity>
                {selectedFile && (
                  <View style={styles.fileName}>
                    <Text>Selected file: {getFilename()}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                onPress={registerJournalist}
                style={styles.button}
              >
                <Text
                  style={{ fontWeight: "bold", fontSize: 22, color: "white" }}
                >
                  Register as Journalist
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default JournalistRegistration;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeAreaView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    paddingTop: 20,
    paddingBottom: 10,
    width: 400,
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  uploadSection: {
    alignItems: "center",
    marginTop: 20,
  },
  uploadLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  uploadButton: {
    backgroundColor: "#026efd",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  uploadButtonText: {
    color: "white",
  },
  fileName: {
    marginTop: 5,
  },
  button: {
    marginTop: 50,
    height: 70,
    width: 250,
    backgroundColor: "#026efd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
});
