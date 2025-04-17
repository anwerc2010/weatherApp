import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useGetWeatherByCityQuery } from '../services/weatherApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import SearchBar from '../components/SearchBar';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import WeatherCard from '../components/WeatherCard';

export default function HomeScreen() {
    const [city, setCity] = useState('London');
    const [searchCity, setSearchCity] = useState('');
    const isConnected = useNetworkStatus();
    const { data, error, isLoading } = useGetWeatherByCityQuery(searchCity, {
        skip: !city,
    });
    const { t } = useTranslation();


    const handleSearch = async () => {
        console.log(city);
        if (city.trim() && isConnected) {
            setSearchCity(city.trim());
            await AsyncStorage.setItem('@lastCity', city.trim());
        }
    };

    useEffect(() => {
        const loadLastCity = async () => {
            const storedCity = await AsyncStorage.getItem('@lastCity');
            if (storedCity && isConnected) {
                setCity(storedCity);
                setSearchCity(storedCity);
            }
        };

        loadLastCity();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>🌦️ {t('weatherFinder')}</Text>

                <SearchBar
                    value={city}
                    onChangeText={setCity}
                    onSearch={handleSearch}
                    placeholder={t('search_placeholder')}
                    searchButtonText={t('search_button')}
                />

                {!isConnected ? (<Text style={styles.errorText}>❌ {t('no_internet_error')}</Text>) : (
                    <View>
                        {isLoading && <ActivityIndicator testID="ActivityIndicator" size="large" color="#007AFF" style={styles.mt20} />}
                        {error && <Text style={styles.errorText}>❌ {t('error_message')}</Text>}
                        {data && <WeatherCard data={data} />}
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff', // optional: match your theme
    },
    container: {
        paddingHorizontal: 16,
        marginVertical: 16,
        marginTop: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },

    errorText: {
        color: 'red',
        marginTop: 15,
        textAlign: 'center',
    },
    mt20: {
        marginTop: 20,
    }
});
