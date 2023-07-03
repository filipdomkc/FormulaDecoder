import React, {useState, useEffect} from 'react';
import { View, Text,StyleSheet, Modal, Dimensions,TouchableOpacity, Linking } from 'react-native';
import { createDrawerNavigator, } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons'; 
import Home from './screens/Home';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';


const Drawer = createDrawerNavigator();

const handleLinkPress = () => {
  // Define the URL you want to open
  const url = 'http://formuladecoder.tech';

  // Open the URL using Linking module
  Linking.openURL(url);
};

const SettingsModalContent = ({ closeModal }) => (
  <View style={styles.modalContainer}>
    <TouchableOpacity  onPress={closeModal}>
      <Text style={styles.closeButton}> Close </Text>
    </TouchableOpacity>
    <Text style={styles.modalTitle}>Settings</Text>
  </View>
);

const AboutModalContent = ({ closeModal }) => (
  <View style={styles.modalContainer}>
    <TouchableOpacity  onPress={closeModal}>
      <Text style={styles.closeButton}> Close </Text>
    </TouchableOpacity>
    <View style={styles.modalContent}>
      <Text style={styles.textContainer}>
        <Text style={styles.modalText}>FORMULA</Text>
        <Text style={styles.boldText}>DECODER.</Text>
      </Text>
    </View>
    <View style={styles.linkContainer}>
      <TouchableOpacity onPress={handleLinkPress}>
        <Text style={styles.linkText}>www.formuladecoder.tech</Text>
      </TouchableOpacity>
        <Text style={styles.contact}> Contact me: </Text>
        <Text style={[styles.linkText, {marginTop:10}]}>filip.domovic@gmail.com</Text>
    </View>
    <View style={styles.linkContainer}>
      <Text style={{color:'#00df9a', fontSize: 16, marginTop:10}}>  TERMS OF USE </Text>
      <Text style={{color:'#00df9a', fontSize: 16, marginTop:10}}>PRIVACY POLICY</Text>
      <Text style={{color:'#00df9a', fontSize: 16, marginTop:10}}> OPEN-SOURCE SOFTWARE </Text>
    </View>
  </View>
);

const CustomDrawerContent = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDrawerItem, setSelectedDrawerItem] = useState(null);

  {/*useEffect(() => {
    if (!modalVisible) {
    props.navigation.openDrawer();
    }
  }, [modalVisible]);*/}

  const handleOpenModal = (drawerItem) => {
    setSelectedDrawerItem(drawerItem);
    props.navigation.closeDrawer()
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedDrawerItem(null);
    setModalVisible(false);
  };


  return (
    <View style={{flex:1, backgroundColor:'black'}}>
      <DrawerContentScrollView {...props} contentContainerStyle={{backgroundColor:'#black'}} open={false}>
        <View style={styles.content}>
            <Text style={styles.textContainer}>
              <Text style={styles.text}>FORMULA</Text>
              <Text style={styles.boldText}>DECODER.</Text>
            </Text>
        </View>
        <DrawerItem {...props}
          label="Home"
          onPress={() => props.navigation.navigate('Home')}
          icon={({color}) => <AntDesign name="home" size={24} color="#00df9a" />}
          labelStyle={styles.drawerItemLabel}

        />
        <DrawerItem {...props}
          label="Settings"
          onPress={() => handleOpenModal('settings')}
          icon={({color}) => <AntDesign name="setting" size={24} color="#00df9a" />}
          labelStyle={styles.drawerItemLabel}
        />
        <DrawerItem {...props}
          label="About"
          onPress={() => handleOpenModal('about')}
          icon={({color}) => <AntDesign name="infocirlceo" size={24} color="#00df9a" />}
          labelStyle={styles.drawerItemLabel}
        />
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.container}>
            <View style={styles.modalContainer}>
              {selectedDrawerItem === 'about' && (
                <AboutModalContent closeModal={handleCloseModal}>
                  {/* Additional children components can be passed here */}
                </AboutModalContent>
              )}
              {selectedDrawerItem === 'settings' && (
                <SettingsModalContent closeModal={handleCloseModal}>
                  {/* Additional children components can be passed here */}
                </SettingsModalContent>
              )}
            </View>
          </View>
        </Modal>
      </DrawerContentScrollView>
    </View>

  );
};

const App = () => {
  return (
      <NavigationContainer>
        <Drawer.Navigator 
          defaultStatus='closed'
          initialRouteName="Home"
          drawerContent={props => <CustomDrawerContent {...props}/>} 
          screenOptions={{
            headerShown:false, 
            drawerActiveBackgroundColor:'#00df9a',
            drawerInactiveTintColor:'#00df9a',
            drawerActiveTintColor:'#fff',
            drawerLabelStyle:{
              marginLeft:-20, 
              fontSize:16
              },
          }}>
          <Drawer.Screen name="Home" component={Home} options={{
            drawerIcon: ({color}) => (
              <AntDesign name="home" size={24} color={color} />
            )
          }}/>
          <Drawer.Screen name="About" options={{
            drawerIcon: ({color}) => (
              <AntDesign name="infocirlceo" size={24} color={color} />
            )
          }}>
            {() => null} 
          </Drawer.Screen>
          <Drawer.Screen name="Settings" options={{
            drawerIcon: ({color}) => (
              <AntDesign name="setting" size={24} color={color} />
            )
          }}>
            {() => null}
          </Drawer.Screen>
        </Drawer.Navigator>
      </NavigationContainer>
  );
};

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding:20,
    marginTop:70,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right:-160,
    color:"#00df9a",
    fontSize: 17
  },
  home: {
    flex: 1,
    backgroundColor: 'black',
    color: 'white'
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#00df9a'
  },
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
  drawerItemLabel: {
    color: '#00df9a',
  },
  modalContent: {
    marginTop: 150

  },
  linkContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
    marginTop: 75
  },
  linkText: {
    fontSize:18,
    color: '#00df9a',
    textDecorationLine: 'underline',
  },
  contact: {
    marginTop: 50,
    fontSize:18,
    color: 'grey',
  },
});

export default App;