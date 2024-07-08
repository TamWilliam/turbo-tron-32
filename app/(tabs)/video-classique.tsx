import React, { useEffect, useState } from 'react';
import { Text, View, Button } from 'react-native';

const WebSocketExample = () => {
  const [message, setMessage] = useState('Connecting...');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Remplacez l'URL par l'URL de votre serveur WebSocket
    const websocket = new WebSocket('ws://192.168.122.50/ws');

    websocket.onopen = () => {
      console.log('WebSocket connection opened');
      setMessage('Connected');
    };

    websocket.onmessage = (e) => {
      console.log('Message received: ', e.data);
      setMessage(e.data);
    };

    websocket.onerror = (e) => {
      console.error('WebSocket error: ', e.message);
      setMessage('Error');
    };

    websocket.onclose = (e) => {
      console.log('WebSocket connection closed: ', e.code, e.reason);
      setMessage('Disconnected');
    };

    setWs(websocket);

    // Nettoyage lors de la fermeture du composant
    return () => {
      websocket.close();
    };
  }, []);

  const sendStart = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message = {
        cmd: 9,
        data: 1,
      };
      ws.send(JSON.stringify(message));
      console.log('Message sent: ', message);
    } else {
      console.log('WebSocket is not open');
    }
  };

  const sendStop = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message =  {
        cmd: 9,
        data: 0,
      };
      ws.send(JSON.stringify(message));
      console.log('Message sent: ', message);
    } else {
      console.log('WebSocket is not open');
    }
  };

  return (
    <View>
      <Text>{message}</Text>
      <Button title="Start" onPress={sendStart} />
      <Button title="Stop" onPress={sendStop} />
    </View>
  );
};

export default WebSocketExample;