import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from "react-native";
import firebase from "../../config";

const AdminDashboard = () => {
  const [pendingRegistrations, setPendingRegistrations] = useState([]);

  useEffect(() => {
    const fetchPendingRegistrations = async () => {
      const registrationsSnapshot = await firebase
        .firestore()
        .collection("users")
        .where("role", "==", "journalist")
        .where("status", "==", "pending")
        .get();

      const registrations = registrationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPendingRegistrations(registrations);
    };

    fetchPendingRegistrations();
  }, []);

  const acceptRegistration = async (registrationId) => {
    try {
      await firebase.firestore().collection("users").doc(registrationId).update({
        status: "active",
      });

      // Send acceptance email to the journalist
      const registration = pendingRegistrations.find((registration) => registration.id === registrationId);

      await firebase.auth().sendPasswordResetEmail(registration.email);

      // Remove the accepted registration from the pending registrations list
      setPendingRegistrations((prevState) =>
        prevState.filter((registration) => registration.id !== registrationId)
      );

      alert("Registration accepted successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  const rejectRegistration = async (registrationId) => {
    try {
      await firebase.firestore().collection("users").doc(registrationId).update({
        status: "rejected",
      });

      // Send rejection email to the journalist
      const registration = pendingRegistrations.find(
        (registration) => registration.id === registrationId
      );

      // Add your logic here to send a rejection email to the journalist

      // Remove the rejected registration from the pending registrations list
      setPendingRegistrations((prevState) =>
        prevState.filter((registration) => registration.id !== registrationId)
      );

      alert("Registration rejected successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  const renderRegistrationItem = (registration) => {
    const viewCV = async () => {
      try {
        const userDoc = await firebase.firestore().collection("users").doc(registration.id).get();
        const user = userDoc.data();

        if (user.cv) {
          Linking.openURL(user.cv);
        } else {
          alert("CV not available");
        }
      } catch (error) {
        alert(error.message);
      }
    };

    return (
      <View style={styles.registrationItem} key={registration.id}>
        <Text style={styles.name}>{`${registration.firstName} ${registration.lastName}`}</Text>
        <TouchableOpacity style={styles.viewCVButton} onPress={viewCV}>
          <Text style={styles.viewCVButtonText}>View CV</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptButton} onPress={() => acceptRegistration(registration.id)}>
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectButton} onPress={() => rejectRegistration(registration.id)}>
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pending Registrations</Text>
      {pendingRegistrations.length > 0 ? (
        pendingRegistrations.map(renderRegistrationItem)
      ) : (
        <Text style={styles.noRegistrationsText}>No pending registrations.</Text>
      )}
    </ScrollView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  registrationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
  },
  name: {
    flex: 1,
    marginRight: 8,
  },
  viewCVButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 6,
  },
  acceptButton: {
    backgroundColor: "#026efd",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  rejectButton: {
    backgroundColor: "#ff0000",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  viewCVButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  acceptButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  rejectButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  noRegistrationsText: {
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 32,
  },
});
