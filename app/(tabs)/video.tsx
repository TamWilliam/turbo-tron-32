import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Video } from 'expo-av';

const App = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Access the video reference
    // console.log(videoRef.current);
  }, []);

  return (
    <View style={{ flexGrow: 1, flex: 1 }}>
      <Text style={styles.mainTitle}>AC Video Player</Text>
      <View style={{ flex: 1 }}>
        <Video
          source={{ uri: 'https://www.aranacorp.com/wp-content/uploads/rovy-avoiding-obstacles.mp4' }} // Distant file
          ref={videoRef} // Store reference
          shouldPlay
          resizeMode="cover"
          onPlaybackStatusUpdate={(status) => {
            console.log(status);
          }}
          style={styles.backgroundVideo}
        />
      </View>
    </View>
  );
};

export default App;

const BACKGROUND_COLOR = "#161616"; //191A19
const BUTTON_COLOR = "#346751"; //1E5128
const ERROR_COLOR = "#C84B31"; //4E9F3D
const TEXT_COLOR = "#ECDBBA"; //D8E9A8
const styles = StyleSheet.create({
  mainTitle: {
    color: TEXT_COLOR,
    fontSize: 30,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: ERROR_COLOR,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
