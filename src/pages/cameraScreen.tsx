import { HelloWave } from "./components/helloWave";
import ParallaxScrollView from "./components/parallaxScrollView";
import Ionicons from '@expo/vector-icons/Ionicons';

import React, { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  Linking,
  TextInput,
  Modal,
} from "react-native";

import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  const [scannedLink, setScannedLink] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [favoriteName, setFavoriteName] = useState<string>("");

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function handleBarcodeScanned(barcodeScanningResult: any) {
    const link = barcodeScanningResult.data;
    setScannedLink(link);
  }

  function handleLinkPress() {
    if (scannedLink) {
      Linking.openURL(scannedLink);
    }
  }

  async function handleSaveFavorite() {
    const currentDate = new Date();
    const favorite = {
      name: favoriteName,
      link: scannedLink,
      date: currentDate,
    };

    try {
      const existingFavorites = await AsyncStorage.getItem('favorites');
      const favoritesArray = existingFavorites ? JSON.parse(existingFavorites) : [];
      favoritesArray.push(favorite);
      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
    } catch (error) {
      console.error("Erro ao salvar favorito", error);
    }

    setModalVisible(false);
    setFavoriteName("");
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Ionicons size={310} name="camera" style={styles.headerImage} />
        // <Image
        //   source={require("./assets/images/banner.jpeg")}
        //   style={styles.reactLogo}
        // />
      }
    >
      <View style={styles.titleContainer}>
        <Text>Aponte a câmera</Text>
        <HelloWave />
      </View>

      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing={facing}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={handleBarcodeScanned}
        >
          <View style={styles.buttonContainer}></View>

      {scannedLink && (
        <View style={styles.linkContainer}>
          <TouchableOpacity style={styles.card} onPress={handleLinkPress}>
            <Text style={styles.linkText}>Abrir Link: {scannedLink}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.starButton}
            onPress={() => setModalVisible(true)}
          >
            <Text>🌟</Text>
          </TouchableOpacity>
        </View>
      )}
        </CameraView>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Nome do Link Favorito</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome"
              value={favoriteName}
              onChangeText={setFavoriteName}
            />
            <View style={styles.modalButtonContainer}>
              <Button title="Salvar" onPress={handleSaveFavorite} />
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
    justifyContent: "center",
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
  },
  camera: {
    flex: 1,
    width: "100%",
    minHeight: 350,
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#007AFF",
    alignItems: "center",
    marginTop: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  linkText: {
    fontSize: 16,
    color: "#007AFF",
    textAlign: "center",
  },
  card: {
    maxWidth: "90%",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: "center",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  starButton: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
  },
  modalButtonContainer: {
    width: 200,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
});

