import React, { useState } from "react";
import { StyleSheet, View, Modal, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";

const Map = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const navigation = useNavigation();
  const palestine = {
    latitude: 31.9522,
    longitude: 35.2332,
    latitudeDelta: 4.5,
    longitudeDelta: 4.5,
  };
  const jenin = {
    latitude: 32.4637,
    longitude: 35.2951,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    markerTitle: "Jenin",
    id: "jenin-marker",
    newsUrl: "JeninNews",
  };

  const nablus = {
    latitude: 32.2226,
    longitude: 35.2594,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    markerTitle: "Nablus",
    id: "nablus-marker",
    newsUrl: "NablusNews",
  };

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
  };

  const handleCloseModal = () => {
    setSelectedMarker(null);
  };

  const handleNewsButtonPress = () => {
    if (selectedMarker) {
      navigation.navigate(selectedMarker.newsUrl);
      setSelectedMarker(null);
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={palestine}>
        <Marker
          coordinate={{
            latitude: jenin.latitude,
            longitude: jenin.longitude,
          }}
          identifier={jenin.id}
          onPress={() => handleMarkerPress(jenin)}
        />
        <Marker
          coordinate={{
            latitude: nablus.latitude,
            longitude: nablus.longitude,
          }}
          identifier={nablus.id}
          onPress={() => handleMarkerPress(nablus)}
        />
      </MapView>
      <Modal visible={!!selectedMarker} animationType="slide" transparent={true}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>{selectedMarker?.markerTitle}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={handleNewsButtonPress}>
              <Text style={styles.modalButtonText}>News</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Livestream's</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseModal}>
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    flex: 1,
    width: "100%",
  },
  modal: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    margin: 20,
    justifyContent: "center",
    marginTop: 150,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowOpacity: 0.25,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 100,
    marginLeft: 30,
    marginRight: 30,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalCloseButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  modalCloseButtonText: {
    color: "#2196F3",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
});

export default Map;
