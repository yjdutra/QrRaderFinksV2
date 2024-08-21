import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ParallaxScrollView from './components/parallaxScrollView';

interface Favorite {
  name: string;
  date: string;
  link: string;
}

export default function FavoriteScreen() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos', error);
    }
  };

  useEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleLinkPress = (link: string) => {
    Linking.openURL(link);
  };

  const handleDeleteFavorite = async (index: number) => {
    try {
      const updatedFavorites = [...favorites];
      updatedFavorites.splice(index, 1);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Erro ao deletar favorito', error);
    }
  };

  const handleSupportPress = () => {
    Linking.openURL('https://www.buymeacoffee.com/yjdutra');
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="star" style={styles.headerImage} />}
    >
      <View style={styles.titleContainer}>
        <Text >⭐ Lista de Favoritos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.favoritesContainer}>
        {favorites.length > 0 ? (
          favorites.map((favorite, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.favoriteName}>{favorite.name}</Text>
              <Text style={styles.favoriteDate}>Salvo em: {favorite.date}</Text>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => handleLinkPress(favorite.link)}
              >
                <Text style={styles.linkButtonText}>Abrir Link</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteFavorite(index)}
              >
                <Ionicons name="close" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noFavoritesText}>Nenhum favorito salvo.</Text>
        )}
      </ScrollView>

      <View style={styles.supportContainer}>
        <TouchableOpacity onPress={handleSupportPress} style={styles.supportButton}>
          <Text style={styles.supportButtonText}>Buy me a coffee</Text>
        </TouchableOpacity>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
  },
  favoritesContainer: {
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 16,
    position: 'relative',
  },
  favoriteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  favoriteDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  linkButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  linkButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  noFavoritesText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  supportContainer: {
    padding: 20,
    alignItems: 'center',
  },
  supportButton: {
    backgroundColor: '#FFDD00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  supportButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
