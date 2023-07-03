import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const About = () => {
    const navigation = useNavigation();

    const openDrawer = () => {
      navigation.openDrawer();
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.text}>About</Text>
        <Button title="Open Drawer" onPress={openDrawer} />
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: 'green',
      fontSize: 20,
    },
  });

export default About