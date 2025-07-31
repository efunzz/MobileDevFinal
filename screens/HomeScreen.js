// screens/HomeScreen.js
import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, {useState} from 'react';
import AddDeckModal from '../components/AddDeckModal';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const handleOpenModal = () => {
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  return (
    <View style={styles.container}>
      <Pressable style={styles.button} 
        onPress={handleOpenModal}>
        <Text style={styles.text}> + </Text>
      </Pressable>
      <AddDeckModal visible={modalVisible} hideModal={handleCloseModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#000',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
});
