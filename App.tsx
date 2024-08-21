import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Button,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FavoriteScreen from "./src/pages/favoriteScreen";
import CameraScreen from "./src/pages/cameraScreen";

import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [tab, setTab] = useState<number>(1);
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
      <View style={styles.containerRequestButton}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
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
      const existingFavorites = await AsyncStorage.getItem("favorites");
      const favoritesArray = existingFavorites
        ? JSON.parse(existingFavorites)
        : [];
      favoritesArray.push(favorite);
      await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray));
    } catch (error) {
      console.error("Erro ao salvar favorito", error);
    }

    setModalVisible(false);
    setFavoriteName("");
  }

  const truncateLink = (link: string, maxLength = 20) => {
    if (link.length <= maxLength) {
      return link;
    }
    return link.substring(0, maxLength) + "...";
  };

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        {tab === 1 ? (
          <>
            <View style={styles.containerCamera}>
              <CameraView
                style={styles.camera}
                facing={facing}
                barcodeScannerSettings={{
                  barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={handleBarcodeScanned}
              ></CameraView>
            </View>
  
            {scannedLink && (
              <View style={styles.linkContainer}>
                <TouchableOpacity style={styles.card} onPress={handleLinkPress}>
                  <Text style={styles.linkText}>{truncateLink(scannedLink)}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.starButton}
                  onPress={() => setModalVisible(true)}
                >
                  <Text>⭐</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.starButton}
                  onPress={() => setScannedLink(null)}
                >
                  <Text>❌</Text>
                </TouchableOpacity>
              </View>
            )}

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
                    <Button
                      title="Cancelar"
                      onPress={() => setModalVisible(false)}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <FavoriteScreen />
        )}
      </View>

      <View style={styles.navegationContainer}>
        <TouchableOpacity
          style={[
            styles.navegationButton,
            tab === 1 ? styles.activeButton : null,
          ]}
          onPress={() => setTab(1)}
        >
          <Text style={styles.navegationButtonIcon}> 📷 </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navegationButton,
            tab === 2 ? styles.activeButton : null,
          ]}
          onPress={() => setTab(2)}
        >
          <Text style={styles.navegationButtonIcon}> ⭐ </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Create by: Yuri Jorge Dutra</Text>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  containerRequestButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#000",
    justifyContent: "center", // Mudança para centralizar o conteúdo verticalmente
  },
  container: {
    flex: 1,
    // alignItems:"center",
    backgroundColor: "#000",
    justifyContent: "space-between",
  },
  screen: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
  },
  containerCamera: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
    minHeight: 350, // Definindo uma altura mínima para evitar colapsos
    borderRadius: 10,
    overflow: "hidden",
  },
  navegationContainer: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#7c7a7a",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  footer: {
    position: "absolute",
    bottom: 1,
    right: 10,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 10,
    padding: 5,
  },
  footerText: {
    fontSize: 10,
    color: "#000",
  },
  navegationButton: {
    backgroundColor: "rgba(185, 180, 180, 0.1)",
    padding: 15,
    width: "50%",
    height: "100%",
  },
  activeButton: {
    backgroundColor: "rgba(248, 248, 248, 0.5)",
    borderRadius: 5,
  },
  navegationButtonIcon: {
    fontSize: 30,
    color: "#fff",
    textAlign: "center",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  card: {
    maxWidth: 300,
    margin: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  linkText: {
    fontSize: 16,
    color: "#007AFF",
    textAlign: "center",
  },
  starButton: {
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
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
