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
import firebase from "../../config";

const ClientRegistration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const registerClient = async () => {
    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      await userCredential.user.sendEmailVerification({
        handleCodeInApp: true,
        url: "https://newsapp2-bd01a.firebaseapp.com",
      });

      const status = "active";

      await firebase
        .firestore()
        .collection("users")
        .doc(userCredential.user.uid)
        .set({
          firstName,
          lastName,
          email,
          role: "client",
          status,
        });

      alert("Verification Email sent");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.root}>
        <SafeAreaView style={styles.safeAreaView}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.content}
          >
            <View style={styles.container}>
              <Text style={{ fontWeight: "bold", fontSize: 23 }}>
                Client Sign Up
              </Text>
              <View style={{ marginTop: 40 }}>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  onChangeText={(firstName) => setFirstName(firstName)}
                  autoCorrect={false}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  onChangeText={(lastName) => setLastName(lastName)}
                  autoCorrect={false}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  onChangeText={(email) => setEmail(email)}
                  autoCorrect={false}
                  keyboardType="email-address"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  onChangeText={(password) => setPassword(password)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={true}
                />
              </View>
              <TouchableOpacity
                onPress={registerClient}
                style={styles.button}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 22,
                    color: "white",
                  }}
                >
                  Register as Client
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ClientRegistration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 100,
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
  button: {
    marginTop: 120,
    height: 70,
    width: 250,
    backgroundColor: "#026efd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
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
});
