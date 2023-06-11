import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { createStackNavigator } from "react-navigation-stack";

const Stack = createStackNavigator();

const Registration = ({ navigation }) => {
  const handleClientRegistration = () => {
    navigation.navigate("ClientRegistration");
  };

  const handleJournalistRegistration = () => {
    navigation.navigate("JournalistRegistration");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registration</Text>
      <TouchableOpacity onPress={handleClientRegistration} style={styles.button}>
        <Text style={styles.buttonText}>Register as a Client</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleJournalistRegistration}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Register as a Journalist</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#026efd",
    width: 250,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
