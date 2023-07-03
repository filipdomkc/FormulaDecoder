import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';




const WelcomeScreen = () => {      
    const [modalVisible, setModalVisible] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setModalVisible(false);
      }, 2000);
  
      return () => clearTimeout(timer);
    }, []);

      return (
        <View style={styles.container}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.textContainer}>
                  <Text style={styles.modalText}>FORMULA</Text>
                  <Text style={styles.boldText}>DECODER.</Text>
                </Text>
              </View>
            </View>
          </Modal>
        </View>
      );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  modalContent: {
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 24,
    textAlign: 'center',
    color: '#00df9a',
  },
  
  boldText: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    color: '#00df9a',
  },

});

export default WelcomeScreen;