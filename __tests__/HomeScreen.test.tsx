import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';
import { useGetWeatherByCityQuery } from '../redux/services/weatherApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockedUseGetWeatherByCityQuery = useGetWeatherByCityQuery as jest.Mock;

jest.mock('phosphor-react-native', () => {
  return {
    X: () => 'X',
  };
});

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('../redux/services/weatherApi', () => ({
  useGetWeatherByCityQuery: jest.fn(),
}));


jest.mock('../redux/services/weatherApi', () => ({
    useGetWeatherByCityQuery: jest.fn(),
}));
  
describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  it('renders input, search button, and title', () => {
    mockedUseGetWeatherByCityQuery.mockReturnValue({ data: null, error: null, isLoading: false });

    const { getByPlaceholderText, getByText } = render(<HomeScreen />);

    expect(getByPlaceholderText('Enter city')).toBeTruthy();
    expect(getByText('Search')).toBeTruthy();
    expect(getByText('🌦️ Weather Finder')).toBeTruthy();
  });

  it('shows loading indicator when isLoading is true', () => {
    mockedUseGetWeatherByCityQuery.mockReturnValue({ data: null, error: null, isLoading: true });

    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId('ActivityIndicator')).toBeTruthy();
  });

  it('shows error message when error is true', () => {
    mockedUseGetWeatherByCityQuery.mockReturnValue({ data: null, error: true, isLoading: false });

    const { getByText } = render(<HomeScreen />);
    expect(getByText('❌ Error fetching data')).toBeTruthy();
  });

  it('shows weather data card when data is returned', () => {
    mockedUseGetWeatherByCityQuery.mockReturnValue({
      isLoading: false,
      error: null,
      data: {
        name: 'Tokyo',
        main: { temp: 18 },
        weather: [
          {
            description: 'light rain',
            icon: '10d',
          },
        ],
      },
    });

    const { getByText, getByRole } = render(<HomeScreen />);

    expect(getByText('📍 Tokyo')).toBeTruthy();
    expect(getByText('🌡️ 18°C')).toBeTruthy();
    expect(getByText('Light rain')).toBeTruthy();
  });

  it('clears the input when clear icon is pressed', async () => {
    mockedUseGetWeatherByCityQuery.mockReturnValue({ data: null, error: null, isLoading: false });

    const { getByTestId, getByPlaceholderText, getByText } = render(<HomeScreen />);

    const input = getByPlaceholderText('Enter city');
    fireEvent.changeText(input, 'Berlin');

    expect(input.props.value).toBe('Berlin');

    fireEvent.press(getByTestId('clear-button'));

    await waitFor(() => {
      expect(input.props.value).toBe('');
    });
  });

  it('triggers search with trimmed city name on button press', () => {
    mockedUseGetWeatherByCityQuery.mockReturnValue({ data: null, error: null, isLoading: false });

    const { getByPlaceholderText, getByText } = render(<HomeScreen />);

    const input = getByPlaceholderText('Enter city');
    fireEvent.changeText(input, '   Mumbai   ');
    fireEvent.press(getByText('Search'));

    // Mock behavior ensures searchCity gets updated
    expect(useGetWeatherByCityQuery).toHaveBeenCalledWith('Mumbai', expect.any(Object));
  });

  it('loads last searched city from AsyncStorage on mount', async () => {
    await AsyncStorage.setItem('@lastCity', 'Paris');
    mockedUseGetWeatherByCityQuery.mockReturnValue({
      data: {
        name: 'Paris',
        main: { temp: 25 },
        weather: [{ description: 'clear sky', icon: '01d' }],
      },
      isLoading: false,
      error: null,
    });

    const { getByDisplayValue, getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByDisplayValue('Paris')).toBeTruthy();
      expect(getByText(/Paris/)).toBeTruthy();
      expect(getByText(/25°C/)).toBeTruthy();
    });
  });

  it('saves city to AsyncStorage on search', async () => {
    mockedUseGetWeatherByCityQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    const { getByPlaceholderText, getByText } = render(<HomeScreen />);
    const input = getByPlaceholderText('Enter city');

    fireEvent.changeText(input, 'Tokyo');
    fireEvent.press(getByText('Search'));

    await waitFor(async () => {
      const value = await AsyncStorage.getItem('@lastCity');
      expect(value).toBe('Tokyo');
    });
  });
});
