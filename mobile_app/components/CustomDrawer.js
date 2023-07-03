import { View, Text,StyleSheet, Modal, TouchableOpacity } from 'react-native';
import React, {useState} from 'react';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';



const CustomDrawer = (props) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleAboutPress = () => {
    toggleModal();
    props.navigation.closeDrawer();
  };

  return (
    <View style={{flex:1, backgroundColor:'black'}}>
        <DrawerContentScrollView {...props} contentContainerStyle={{backgroundColor:'#black'}}>
            <View style={styles.content}>
                <Text style={styles.textContainer}>
                  <Text style={styles.text}>FORMULA</Text>
                  <Text style={styles.boldText}>DECODER.</Text>
                </Text>
            </View>
            <View style={{flex:1, backgroundColor:'black', paddingTop:30}}>
              <DrawerItemList
                {...props}
              />
            </View>          
        </DrawerContentScrollView>       
    </View>

  )
}

const styles = StyleSheet.create({
    textContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'nowrap',
    },
    content: {
      backgroundColor: 'black',
      width: '100%',
      height: '50%',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth:1,
      borderBottomColor:'#00df9a'
    },
    text: {
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

export default CustomDrawer