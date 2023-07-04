import axios from 'axios';
import { Camera } from 'expo-camera';
import 'react-native-gesture-handler';
import Animation from '../components/Animation';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome } from '@expo/vector-icons'; 
import * as ImageManipulator from 'expo-image-manipulator';
import React, { useEffect, useState, useRef }  from 'react';
import MaskedView from '@react-native-masked-view/masked-view';
import { TouchableOpacity, StyleSheet, Text, Image, View, Button, PanResponder, Dimensions, Modal, Platform } from 'react-native';

const ScreenWidth = Dimensions.get('screen').width;
const ScreenHeight = Dimensions.get('screen').height;
const x = ScreenWidth / 2
const y = ScreenHeight / 2
const MinSize = 50;
const MaxSize = Math.min(ScreenWidth, ScreenHeight) - 50;
const API_URL='http://formuladecoder.tech:8000/uploadfile'


function Home() {

  const [width, setWidth] = useState(350);
  const [height, setHeight] = useState(100);
  const [maskWidth, setMaskWidth] = useState(null);
  const [maskHeight, setMaskHeight] = useState(null);
  const [maskOriginX, setMaskOriginX] = useState (null);
  const [maskOriginY, setMaskOriginY] = useState (null);

  const [permission, setPermission] = useState(null);
  const [flashOn, setFlashOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scan,setScan] = useState(false);
  const cameraRef = useRef(null); 
  const capturedPhotoRef = useRef(null);
  const [image, setImage] = useState(null);
  const maskedViewRef = useRef(null);
  const type = Camera.Constants.Type.back;
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(true);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [pickedImage, setPickedImage] = useState(null);
  const [response, setResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [solution,setSolution] = useState (null)


  useEffect(() => {
    const timer = setTimeout(() => {
      setModalVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const openDrawer = () => {
    navigation.openDrawer();
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      const newWidth = Math.max(MinSize, Math.min(width + gesture.dx, MaxSize));
      const newHeight = Math.max(MinSize, Math.min(height + gesture.dy, MaxSize));
      setWidth(newWidth);
      setHeight(newHeight);
    },
  });

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermission({ granted: status === 'granted' });
    })();
  }, []);


  const requestPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setPermission({ granted: status === 'granted' });
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleFlashToggle = () => {
    setFlashOn((prevFlashOn) => !prevFlashOn);
  };

  const handleLayout = () => {
    maskedViewRef.current.measure((x, y, width, height, pageX, pageY) => {
      setMaskWidth(Math.round(width * 5));
      setMaskHeight(Math.round(height * 5));
      setMaskOriginX(Math.round(pageX * 5));
      setMaskOriginY(Math.round(pageY * 5));
    });
  };

  const handleButtonPress = () => {
    setLoading(true);
    setTimeout(() => {
      setScan(true);
    }, 1000);
  };

  const handleCapture = async () => {
    handleButtonPress();
    
  
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      capturedPhotoRef.current = photo;
    }
  
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        capturedPhotoRef.current.uri,
        [{ crop: {height:maskHeight, originX:maskOriginX, originY:maskOriginY, width:maskWidth }}],
        { compress: 0.5, format: ImageManipulator.SaveFormat.PNG }
      );
  
      if (Platform.OS === 'ios') {
        await MediaLibrary.saveToLibraryAsync(manipulatedImage.uri);
      } else {
        await MediaLibrary.createAssetAsync(manipulatedImage.uri);
      };

      if (manipulatedImage){
        console.log(manipulatedImage)
        // Use the API_URL variable
        console.log(API_URL);

        const formData = new FormData();
        formData.append('image', {
          uri: manipulatedImage.uri,
          name: 'image.png',
          type: 'image/png',
        });
        
        try {
          const response = await axios.post(API_URL , formData);

          console.log('File uploaded successfully!', response);
          setResponse(response)
          setResultModalVisible(true);
          setSolution(response.data.result)

        } catch (error) {
          console.error('Error uploading file!', error);
          setErrorMessage('Could not read the image. Please try again!');
          setErrorModalVisible(true)
        }
      }

    } catch (error) {
      console.log(error);
      alert('An error occurred while manipulating or saving the image.');
    }
  };
  
  
  const onAnimationFinish = () => {
    setLoading(false);
  };

  const onScanAnimationFinish = () => {
    setScan(false);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    setPickedImage(result.uri)

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }

    const formData = new FormData();
    formData.append('image', {
      uri: result.uri,
      type: 'image/png', // Specify the file type as 'image/png'
      name: 'image.png', // Set the file name with the correct extension
    });

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Image upload response:', response.data);
      setResponse(response);
      setResultModalVisible(true);
      setSolution(response.data.result)
      console.log(typeof(solution))
      // Handle the response as needed
    } catch (error) {
      console.error('Image upload error:', error);
      setErrorMessage(error);
      setErrorModalVisible(true)
 
    }
  };

  const handleCloseModal = () => {
    setResultModalVisible(false);
    setErrorModalVisible(false);
  };
  


  return (
      <View style={styles.container} {...panResponder.panHandlers}>
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
        <MaskedView
          
          style={[styles.maskedView, styles.center]}
          maskElement={
            <View style={[styles.maskWrapper, styles.center]}>
              <View ref={maskedViewRef} onLayout={handleLayout} style={[styles.mask, { width, height }]}></View>
            </View>
          }
          {...panResponder.panHandlers}
        >
          <View style={styles.container}>
            <Camera ref={cameraRef} style={styles.camera} type={type} flashMode={flashOn ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off} />
          </View>
        </MaskedView>

        {image ? <Image resizeMode = 'contain' style = {styles.imagepreview} source={{uri: image}}/>: <></>}
        {scan ? <Animation source={require('../assets/scan.json')} style={styles.scanner} onAnimationFinish={onScanAnimationFinish} autoplay={true} loop={false} speed={1.5} /> : <></>}

        {loading ? (
          <Animation source={require('../assets/spinner_24.json')} style={styles.spinner} onAnimationFinish={onAnimationFinish} autoplay={true} loop={false} speed={1.5} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleCapture}>
            <View style={styles.buttonInner} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.menu} onPress={openDrawer} >
          <Ionicons name="ios-menu" size={34} color="white" />
        </TouchableOpacity>

        <View style={styles.icons}>
          <TouchableOpacity onPress={pickImage}>
            <FontAwesome name="photo" size={24} color="white" style={styles.photo} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleFlashToggle}>
            {flashOn ? (
              <Ionicons name="flash" size={24} color="white" />
            ) : (
              <Ionicons name="flash-off" size={24} color="white" />
            )}
          </TouchableOpacity>
        </View>
        { solution && 
        <Modal visible={resultModalVisible} animationType="slide" transparent={true}>
          <View style={styles.resultContainer}>
            <View style={styles.resultModalContainer}>
              <TouchableOpacity  onPress={handleCloseModal}>
                <Text style={styles.closeButton}> Close </Text>
              </TouchableOpacity>
              <Text style={styles.solution}>{solution}</Text>
            </View>
          </View>
        </Modal> 
        }
        { errorMessage && 
        <Modal visible={errorModalVisible} animationType="slide" transparent={true}>
          <View style={styles.resultContainer}>
            <View style={styles.resultModalContainer}>
              <TouchableOpacity  onPress={handleCloseModal}>
                <Text style={styles.closeButton}> Close </Text>
              </TouchableOpacity>
              <Text style={styles.error}>Hmmm, that doesnt't look right</Text>
              <Text style={styles.errorMsg}>Sorry, we can only help with math. Please, retake picture or pick a picture from gallery</Text>
            </View>
          </View>
        </Modal> 
        }
      </View>
);
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  maskedView: {
    flex: 1,
    flexDirection: 'row',
    height: '100%'
  },
  maskWrapper: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mask: {
    width: 350,
    height: 150,
    backgroundColor: '#000',
    borderRadius: 15,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 125, // Place the button at the bottom of the screen
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: 'rgba(2, 82, 57, 0.75)', // Set the border color with 75% transparency
    borderWidth: 4,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0, // Set a lower z-index to appear below the camera
    alignSelf: 'center', // Align the button horizontally in the center
  },
  buttonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 223, 154, 0.75)',
  },
  preview: {
    marginTop: 20,
    alignItems: 'center',
  },
  previewText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  photo: {

    alignItems: 'center',

  },
  icons:{
    position: 'absolute',
    bottom: 20, // Place the button at the bottom of the screen
    justifyContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100,
    width: 150,
    zIndex: 0, // Set a lower z-index to appear below the camera
    alignSelf: 'center', // Align the button horizontally in the center
  },
  menu:{
    position: 'absolute',
    top: 75, // Place the button at the bottom of the screen
    left: 35,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 0, // Set a lower z-index to appear below the camera
    alignSelf: 'center', // Align the button horizontally in the center
  },
  spinner: {
    flex: 1,
    position: 'absolute',
    bottom: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0, // Set a lower z-index to appear below the camera
    alignSelf: 'center', // Align the button horizontally in the center
  },
  scanner: {
    flex: 1,
  },
  imagepreview: {
    position: 'absolute',
    flex:1,
    flexDirection: 'row',
    height: '100%'
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
  resultContainer:{
    flex: 1,
    alignSelf:'center',
    backgroundColor: 'black',
    padding:20,
    marginTop:500,
    marginBottom:100 ,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    width: '80%',
    paddingHorizontal:20,
    paddingVertical:30,
  },
  resultModalContainer:{
    flex: 1,

  },
  closeButton: {
    position: 'absolute',
    right:20,
    color:"#00df9a",
    fontSize: 17
  },
  solution: {
    alignSelf:'center',
    marginTop: 105,
    color:"#00df9a",
    fontSize: 25
  },
  error: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    color: '#00df9a',
    marginTop: 40 
  },
  errorMsg:{
    fontSize: 14,
    textAlign: 'center',
    color: '#00df9a',
    marginTop: 15
  }
});

export default Home;