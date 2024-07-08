import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { ReactNativeJoystick } from '@korsolutions/react-native-joystick';

const App = () => {
  const [joystickCoords, setJoystickCoords] = useState({ x: 0, y: 0 });
  const [joystickCoordsRepere, setJoystickCoordsRepere] = useState({ x2: 0, y2: 0 });
  const [dataAngle, setDataAngle] = useState(0);
  const [radian, setRadian] = useState(0);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket('wss://192.168.122.50/ws'); // Remplacez par l'adresse IP de votre ESP32

    websocket.onopen = () => {
      console.log('Connected to WebSocket server');
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      console.log('Received:', event.data);
    };

    websocket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      websocket.close();
    };
  }, []);

  const sendCommand = (command) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(command));
    }
  };

  const handleJoystickMove = (data) => {
    let { x, y } = data.position;
    let { screenX, screenY } = data.position;
    const { degree, radian } = data.angle;

    // Calcul de la distance par rapport à l'origine
    const distance = Math.sqrt(screenX * screenX + screenY * screenY);
    const maxDistance = 1.5;
    
    if (distance > maxDistance) {
        // Limiter les coordonnées à la distance maximale en fonction de l'angle
        screenX = maxDistance * Math.cos(radian);
        screenY = maxDistance * Math.sin(radian);
    }

    screenX = screenX / 3 * 2 * 100;
    screenY = screenY / 3 * 2 * 100;

    setJoystickCoords({ x, y });
    setJoystickCoordsRepere({ x2: screenX, y2: screenY });
    setDataAngle(degree);
    setRadian(radian);
  };

  useEffect(() => {
    if (joystickCoordsRepere.y2 > 0) {
      sendCommand({
        cmd: 1,
        data: [1000, 1000, 1000, 1000]
      });
    } else if (joystickCoordsRepere.y2 < 0) {
      sendCommand({
        cmd: 1,
        data: [-1000, -1000, -1000, -1000]
      });
    } else {
      sendCommand({
        cmd: 1,
        data: [0, 0, 0, 0]
      });
    }
  }, [joystickCoordsRepere.y2]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#038ac9' }}>
      <ReactNativeJoystick onMove={handleJoystickMove} onStop={handleJoystickMove} backgroundColor="#d9d9d9" color="#959292" radius={75}/>
      <Text>Coordonnées du joystick : ({joystickCoords.x.toFixed(2)}, {joystickCoords.y.toFixed(2)})</Text>
      <Text>Coordonnées : ({joystickCoordsRepere.x2.toFixed(2)}, {joystickCoordsRepere.y2.toFixed(2)})</Text>
      <Text>Angle : ({dataAngle})</Text>
      <Text>Radian : ({radian})</Text>
    </View>
  );
};

export default App;
