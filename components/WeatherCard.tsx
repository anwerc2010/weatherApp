import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

type WeatherData = {
  name: string;
  main: { temp: number };
  weather: { description: string; icon: string }[];
};

type Props = {
  data: WeatherData;
};

const WeatherCard = ({ data }: Props) => {
  const { name, main, weather } = data;
  const description =
    weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1);

  return (
    <View style={styles.card}>
      <Text style={styles.city}>📍 {name}</Text>
      <Text style={styles.temp}>🌡️ {main.temp}°C</Text>
      <Text style={styles.condition}>{description}</Text>
      <Image
        source={{
          uri: `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`,
        }}
        style={styles.icon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  city: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
  },
  temp: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  condition: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  icon: {
    width: 80,
    height: 80,
  },
});

export default WeatherCard;