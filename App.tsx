import React from 'react';
import {
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import HomeScreen from './screens/HomeScreen';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { I18nextProvider } from 'react-i18next';
import i18n from './localization/i18n';


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <Provider store={store}>
      <View style={backgroundStyle}>
        <I18nextProvider i18n={i18n}>
          <HomeScreen />
        </I18nextProvider>
      </View>
    </Provider>

  );
}

export default App;
