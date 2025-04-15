import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useGetWeatherByCityQuery } from '../redux/services/weatherApi';
import { X } from 'phosphor-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';


export default function HomeScreen() {
  const [city, setCity] = useState('London');
  const [searchCity, setSearchCity] = useState('');
  const { data, error, isLoading } = useGetWeatherByCityQuery(searchCity, {
    skip: !city,
  });
  const { t } = useTranslation();


  const handleSearch = async () => {
    if (city.trim()) {
      setSearchCity(city.trim());
      await AsyncStorage.setItem('@lastCity', city.trim());
    }
  };

  useEffect(() => {
    const loadLastCity = async () => {
      const storedCity = await AsyncStorage.getItem('@lastCity');
      if (storedCity) {
        setCity(storedCity);
        setSearchCity(storedCity);
      }
    };
  
    loadLastCity();
  }, []);

  return (
    <View style={styles.container}>
    <Text style={styles.title}>🌦️ {t('weatherFinder')}</Text>

    <View style={styles.searchSection}>
      <View style={styles.inputWrapper}>
        <TextInput
          value={city}
          onChangeText={setCity}
          placeholder={t('search_placeholder')}
          style={styles.input}
        />
        {city.length > 0 && (
          <TouchableOpacity
            testID="clear-button"
            style={styles.clearIcon}
            onPress={() => setCity('')}
          >
            <X size={20} />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.buttonText}>{t('search_button')}</Text>
      </TouchableOpacity>
    </View>

    {isLoading && <ActivityIndicator testID="ActivityIndicator" size="large" color="#007AFF" style={{ marginTop: 20 }} />}
    {error && <Text style={styles.errorText}>❌ {t('error_message')}</Text>}

    {data && (
      <View style={styles.card}>
        <Text style={styles.city}>📍 {data.name}</Text>
        <Text style={styles.temp}>🌡️ {data.main.temp}°C</Text>
        <Text style={styles.condition}>
          {data.weather[0].description.charAt(0).toUpperCase() +
            data.weather[0].description.slice(1)}
        </Text>
        <Image
          source={{
            uri: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          }}
          style={styles.icon}
        />
      </View>
    )}
  </View>
  );
}

const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      marginVertical: 16,
      marginTop: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
      },
      searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
      },
      inputWrapper: {
        flex: 1,
        position: 'relative',
      },
      input: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        paddingRight: 40, // space for clear icon
        borderWidth: 1,
        borderColor: '#ccc',
      },
      clearIcon: {
        position: 'absolute',
        right: 10,
        top: 10,
      },
      searchButton: {
        marginLeft: 10,
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
      },
      buttonText: {
        color: '#fff',
        fontWeight: '600',
      },
      errorText: {
        color: 'red',
        marginTop: 15,
        textAlign: 'center',
      },
      card: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 25,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
      },
      city: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 10,
      },
      temp: {
        fontSize: 28,
        fontWeight: 'bold',
      },
      condition: {
        fontSize: 18,
        color: '#555',
        marginVertical: 10,
        textTransform: 'capitalize',
      },
      icon: {
        width: 80,
        height: 80,
      },
  });
