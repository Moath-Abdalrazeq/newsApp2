import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const NewsList = ({ city }) => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      const newsRef = firebase.firestore().collection("news");
      const snapshot = await newsRef.where("city", "==", city).get();

      const fetchedNews = [];
      snapshot.forEach((doc) => {
        fetchedNews.push({ id: doc.id, ...doc.data() });
      });

      setNews(fetchedNews);
    };

    fetchNews();
  }, [city]);

  return (
    <View>
      {news.map((item) => (
        <View key={item.id}>
          <Text>Title: {item.title}</Text>
          <Text>Description: {item.description}</Text>
          {/* Display other news details as needed */}
        </View>
      ))}
    </View>
  );
};

export default NewsList;
