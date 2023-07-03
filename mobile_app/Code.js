import React, { useEffect, useState, useRef }  from 'react';
import { TouchableOpacity, StyleSheet, Text, Image, View, Button, PanResponder, Dimensions } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { Camera } from 'expo-camera';
import { Ionicons, FontAwesome } from '@expo/vector-icons'; 
import 'react-native-gesture-handler';
import Animation from './Animation'
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';



const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
const x = ScreenWidth / 2
const y = ScreenHeight / 2
const MinSize = 50;
const MaxSize = Math.min(ScreenWidth, ScreenHeight) - 50;


function App() {

  const [width, setWidth] = useState(350);
  const [height, setHeight] = useState(100);
  const [permission, setPermission] = useState(null);
  const [flashOn, setFlashOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scan,setScan] = useState(false);
  const [cameraRef, setCameraRef] = useState(null); 
  const [capturedImage, setCapturedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [image, setImage] = useState(null);
  const maskedViewRef = useRef(null);
  const type = Camera.Constants.Type.back;


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

  const handleButtonPress = () => {
    setLoading(true);
    setTimeout(() => {
      setScan(true);
    }, 1000);
  };

  const handleCapture = async () => {
    handleButtonPress()

    if (cameraRef) {
        const photo = await cameraRef.takePictureAsync();
        setCapturedImage(photo);
        saveToGallery(photo)
      }
  };

  const cropImage = async (uri, cropWidth, cropHeight, offsetX, offsetY) => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ crop: { originX: offsetX, originY: offsetY, width: cropWidth, height: cropHeight } }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Set the cropped image URI
      setCroppedImage(manipResult);

    } catch (error) {
      console.error('Error while cropping image:', error);
    }
  };
  
  const saveToGallery = async (photo) => {
    try {

      await MediaLibrary.saveToLibraryAsync(photo.uri, 'photo');
      console.log('Image saved to gallery');

    } catch (error) {
      console.log('Error saving image to gallery:', error);
    }
  };
  

  const retakePicture = () => {
    setCapturedImage(null);
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
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <MaskedView
        
        style={[styles.maskedView, styles.center]}
        maskElement={
          <View style={[styles.maskWrapper, styles.center]}>
            <View ref={maskedViewRef} style={[styles.mask, { width, height }]}></View>
          </View>
        }
        {...panResponder.panHandlers}
      >
        <View style={styles.container}>
          <Camera ref={(ref) => setCameraRef(ref)} style={styles.camera} type={type} flashMode={flashOn ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off} />
        </View>
      </MaskedView>

      {image ? <Image resizeMode = 'contain' style = {styles.imagepreview} source={{uri: image}}/>: <></>}
      {scan ? <Animation source={require('./assets/scan.json')} style={styles.scanner} onAnimationFinish={onScanAnimationFinish} autoplay={true} loop={false} speed={1.5} /> : <></>}

      {loading ? (
        <Animation source={require('./assets/spinner_24.json')} style={styles.spinner} onAnimationFinish={onAnimationFinish} autoplay={true} loop={false} speed={1.5} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleCapture}>
          <View style={styles.buttonInner} />
        </TouchableOpacity>
      )}

      <Ionicons name="ios-menu" size={34} color="white" style={styles.menu} />

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
  }
});

export default App;
