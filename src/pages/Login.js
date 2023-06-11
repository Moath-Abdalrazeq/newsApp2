import React, { useState } from "react";
import {
  Keyboard,
  SafeAreaView,
  KeyboardAvoidingView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../../config";
import "firebase/firestore";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      alert("Please fill in your email and password");
    }
  };

  const forgotPassword = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        alert("Password reset email sent to your email");
      })
      .catch(() => {
        alert("Please write your email address");
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.root}>
        <SafeAreaView style={styles.safeAreaView}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.content}
          >
            <View style={styles.center}>
              <Image
                source={require("../../assets/images/Logo.png")}
                style={styles.logo}
              />
              <View style={styles.form}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  onChangeText={(email) => setEmail(email)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Password"
                  onChangeText={(password) => setPassword(password)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={true}
                />
              </View>
              <TouchableOpacity
                onPress={() => forgotPassword()}
                style={{ marginTop: 5 }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => loginUser(email, password)}
                style={styles.button}
              >
                <Text
                  style={{ fontWeight: "bold", fontSize: 22, color: "white" }}
                >
                  Login
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("Registration")}
                style={{ marginTop: 20 }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  Don't have an account? SignUp Now
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    marginTop: 20,
  },
  textInput: {
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
    marginTop: 20,
    height: 70,
    width: 250,
    backgroundColor: "#026efd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
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
