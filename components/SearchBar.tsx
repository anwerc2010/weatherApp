// src/components/SearchBar.tsx

import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { X } from 'phosphor-react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  placeholder?: string;
  searchButtonText?: string;
};

const SearchBar = ({
  value,
  onChangeText,
  onSearch,
  placeholder = 'Search...',
  searchButtonText = 'Search',
}: SearchBarProps) => {
  return (
    <View style={styles.searchSection}>
      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          style={styles.input}
          returnKeyType="search"
          onSubmitEditing={() => {
            Keyboard.dismiss();
            onSearch();
          }}
        />
        {value.length > 0 && (
          <TouchableOpacity
            testID="clear-button"
            style={styles.clearIcon}
            onPress={() => onChangeText('')}
          >
            <X size={20} />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
        <Text style={styles.buttonText}>{searchButtonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#e8e3e3',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  clearIcon: {
    padding: 6,
  },
  searchButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default SearchBar;
