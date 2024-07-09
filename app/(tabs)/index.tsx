import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { ReactNativeJoystick } from '@korsolutions/react-native-joystick';

const App = () => {
  const [joystickCoords, setJoystickCoords] = useState({ x: 0, y: 0 });
  const [joystickCoordsRepere, setJoystickCoordsRepere] = useState({ x2: 0, y2: 0 });
  const [dataAngle, setDataAngle] = useState(0);
  const [radian, setRadian] = useState(0);
  const [ws, setWs] = useState(null);
  const [data, setData] = useState([0, 0, 0, 0]);
  const [dist, setDistance] = useState(0);
  const [message, setMessage] = useState('Connecting...');

  useEffect(() => {
    const websocket = new WebSocket('ws://192.168.36.180/ws'); // Remplacez par l'adresse IP de votre ESP32

    websocket.onopen = () => {
      console.log('Connected to WebSocket server');
      setWs(websocket);
      setMessage('Connected');
    };

    websocket.onmessage = (event) => {
      console.log('Received:', event.data);
    };

    websocket.onclose = () => {
      console.log('Disconnected from WebSocket server');
      setMessage('Disconnected');
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setMessage('Error');
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

    screenX = (screenX / maxDistance) * 100;
    screenY = (screenY / maxDistance) * 100;

    setJoystickCoords({ x, y });
    setJoystickCoordsRepere({ x2: screenX, y2: screenY });
    setDataAngle(degree);
    setRadian(radian);
    setDistance(distance); // <-- Utilisation de la distance calculée ici
  };

  const angleDataMap = [
    { angle: 0, data: [1000, 1000, -1000, -1000] },
    { angle: 45, data: [4000, 4000, 200, 200] },
    { angle: 90, data: [4000, 4000, 4000, 4000] },
    { angle: 135, data: [200, 200, 4000, 4000] },
    { angle: 180, data: [0, 0, 1000, 1000] },
    { angle: 225, data: [-200, -200, -4000, -4000] },
    { angle: 270, data: [-4000, -4000, -4000, -4000] },
    { angle: 315, data: [-4000, -4000, -200, -200] },
    { angle: 360, data: [1000, 1000, -1000, 1000] } // repeat the 0° value for simplicity
  ];

  const interpolateData = (theta) => {
    const lowerIndex = Math.floor(theta / 45);
    const upperIndex = (lowerIndex + 1) % angleDataMap.length;
    
    const lowerAngle = angleDataMap[lowerIndex].angle;
    const upperAngle = angleDataMap[upperIndex].angle;
    
    const lowerData = angleDataMap[lowerIndex].data;
    const upperData = angleDataMap[upperIndex].data;

    const ratio = (theta - lowerAngle) / (upperAngle - lowerAngle);

    const interpolatedData = lowerData.map((lowerValue, index) => {
      const upperValue = upperData[index];
      return lowerValue + ratio * (upperValue - lowerValue);
    });

    return interpolatedData;
  };

  useEffect(() => {
    let commandData = interpolateData(dataAngle);
    if (dist === 0) {
      commandData = commandData.map(() => 0);
    } else {
      commandData = commandData.map(value => parseFloat((value * (dist / 1.41)).toFixed(2)));
    }
    setData(commandData);
    sendCommand({
      cmd: 1,
      data: commandData
    });
  }, [dataAngle]);

  const handleButtonPress = () => {
    // Envoyer la première commande
    sendCommand({cmd: 1, data: [0, 200, 4000, 4000]});

    // Attendre 1 seconde, puis envoyer la seconde commande
    setTimeout(() => {
      sendCommand({cmd: 1, data: [0, 0, 0, 0]});
    }, 500); // 1000 millisecondes = 1 seconde
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#038ac9' }}>
      <Text>{message}</Text> {/* Affichage de l'état de la connexion */}
      <ReactNativeJoystick onMove={handleJoystickMove} onStop={handleJoystickMove} backgroundColor="#d9d9d9" color="#959292" radius={75} />
      <Text>Coordonnées du joystick : ({joystickCoords.x.toFixed(2)}, {joystickCoords.y.toFixed(2)})</Text>
      <Text>Coordonnées : ({joystickCoordsRepere.x2.toFixed(2)}, {joystickCoordsRepere.y2.toFixed(2)})</Text>
      <Text>Angle : ({dataAngle})</Text>
      <Text>Radian : ({radian})</Text>
      <Text>Distance : ({dist.toFixed(2)})</Text> {/* Affichage de la distance avec un formattage */}
      <Text>Data : [{data.join(', ')}]</Text>
      <Button title="Send Command" onPress={handleButtonPress} />
    </View>
  );
};

export default App;