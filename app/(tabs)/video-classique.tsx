import React, { useEffect, useState } from "react";
import { Text, View, Button } from "react-native";

const WebSocketExample = () => {
  const [message, setMessage] = useState("Connecting...");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Remplacez l'URL par l'URL de votre serveur WebSocket
    const websocket = new WebSocket("ws://192.168.225.240/ws");

    const startConnection= () => { 
      websocket.onopen = () => {
      console.log("WebSocket connection opened");
      setMessage("Connected");
    };}

    const stopConnection= () => { 
      websocket.onopen = () => {
      console.log("WebSocket connection opened");
      setMessage("Connected");
    };}

    websocket.onmessage = (e) => {
      console.log("Message received: ", e.data);
      setMessage(e.data);
    };

    websocket.onerror = (e) => {
      console.error("WebSocket error: ", e.message);
      setMessage("Error");
    };

    websocket.onclose = (e) => {
      console.log("WebSocket connection closed: ", e.code, e.reason);
      setMessage("Disconnected");
    };

    setWs(websocket);

    // Nettoyage lors de la fermeture du composant
    return () => {
      websocket.close();
    };
  }, []);

  return (
    <View>
      <Text>{message}</Text>
      <Button title="Start" onPress={startConnection} />
      <Button title="Stop" onPress={stopConnection} />
    </View>
  );
};

export default WebSocketExample;
