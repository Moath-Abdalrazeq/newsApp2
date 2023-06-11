import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, StyleSheet, Alert, Image, Modal, ScrollView } from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const AdminInterface = () => {
  const [pendingNews, setPendingNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchPendingNews = async () => {
      const newsRef = firebase.firestore().collection("news");
      const querySnapshot = await newsRef.where("status", "==", "pending").get();
      const pendingNewsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPendingNews(pendingNewsData);
    };

    fetchPendingNews();
  }, []);

  const handleAcceptNews = (newsId) => {
    const newsRef = firebase.firestore().collection("news").doc(newsId);
    newsRef
      .update({ status: "accepted" })
      .then(() => {
        Alert.alert("Success", "The news has been accepted.");
        removeNewsItem(newsId);
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to accept the news.");
        console.error(error);
      });
  };

  const handleRejectNews = (newsId) => {
    const newsRef = firebase.firestore().collection("news").doc(newsId);
    newsRef
      .update({ status: "rejected" })
      .then(() => {
        Alert.alert("Success", "The news has been rejected.");
        removeNewsItem(newsId);
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to reject the news.");
        console.error(error);
      });
  };

  const removeNewsItem = (newsId) => {
    setPendingNews((prevNews) => prevNews.filter((item) => item.id !== newsId));
  };

  const toggleModal = (item) => {
    setSelectedNews(item);
    setIsModalVisible(!isModalVisible);
  };

  const renderNewsItem = ({ item }) => {
    return (
      <View style={styles.newsItem}>
        <Text style={styles.title}>{item.title}</Text>
        {item.description.length > 100 ? (
          <View>
            <Text style={styles.description} numberOfLines={3}>
              {item.description}
            </Text>
            <Button title="Read More" onPress={() => toggleModal(item)} />
          </View>
        ) : (
          <Text style={styles.description}>{item.description}</Text>
        )}
        <Image source={{ uri: item.mediaUri }} style={styles.image} />
        <View style={styles.buttonContainer}>
          <Button
            title="Accept"
            onPress={() => handleAcceptNews(item.id)}
            color="#006400"
          />
          <Button
            title="Reject"
            onPress={() => handleRejectNews(item.id)}
            color="#8B0000"
          />
        </View>
        <Modal visible={isModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.cardContainer}>
              <Text style={styles.cardTitle}>{selectedNews.title}</Text>
              <Image source={{ uri: selectedNews.mediaUri }} style={styles.Modalimage} />
              <ScrollView style={styles.modalContent}>
                <Text style={styles.cardDescription}>{selectedNews.description}</Text>
              </ScrollView>
              <Button title="Close" onPress={toggleModal} />
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Pending News:</Text>
      <FlatList
        data={pendingNews}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default AdminInterface;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listContainer: {
    flexGrow: 1,
  },
  newsItem: {
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    padding: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    width: "90%",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  Modalimage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalContent: {
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
  },
});
