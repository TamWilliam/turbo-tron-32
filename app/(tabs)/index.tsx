import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { ReactNativeJoystick } from '@korsolutions/react-native-joystick';

const App = () => {
  const [joystickCoordsRepere, setJoystickCoordsRepere] = useState({ x: 0, y: 0 });
  const [force, setForce] = useState(0);
  const [dataAngle, setDataAngle] = useState(0);
  const [radian, setRadian] = useState(0);
  const [ws, setWs] = useState(null);
  const [wsInformations, setWsInformations] = useState("");

  useEffect(() => {
    const websocket = new WebSocket('wss://192.168.122.50/ws'); // Remplacez par l'adresse IP de votre ESP32

    websocket.onopen = () => {
      console.log('Connected to WebSocket server');
      setWs(websocket);
      setWsInformations("Connected to WebSocket server")
    };

    websocket.onmessage = (event) => {
      console.log('Received:', event.data);
      setWsInformations('Received:')
    };

    websocket.onclose = () => {
      console.log('Disconnected from WebSocket server');
      setWsInformations('Disconnected from WebSocket server')
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWsInformations('WebSocket error')
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
    let { screenX, screenY } = data.position;
    const { degree, radian } = data.angle;
    let force = data.force;

    // Mettre la valeur en pourcentage
    screenX = screenX / 3 * 2 * 100;
    screenY = screenY / 3 * 2 * 100;
    force = force / 3 * 2 * 100;

    setJoystickCoordsRepere({ x: screenX, y: screenY });
    setForce(force);
    setDataAngle(degree);
    setRadian(radian);
  };

  useEffect(() => {
    if (joystickCoordsRepere.y > 0) {
      sendCommand({
        cmd: 1,
        data: [1000, 1000, 1000, 1000]
      });
    } else if (joystickCoordsRepere.y < 0) {
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
  }, [joystickCoordsRepere.y]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#038ac9' }}>
      <ReactNativeJoystick onMove={handleJoystickMove} onStop={handleJoystickMove} backgroundColor="#d9d9d9" color="#959292" radius={75}/>
      <Text>Coordonnées du joystick : ({joystickCoordsRepere.x.toFixed(2)}, {joystickCoordsRepere.y.toFixed(2)})</Text>
      <Text>Force : {force}%</Text>
      <Text>Angle : ({dataAngle})</Text>
      <Text>Radian : ({radian})</Text>
      <Text>Websocket info : {wsInformations}</Text>
    </View>
  );
};

export default App;
