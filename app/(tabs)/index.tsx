import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { ReactNativeJoystick } from "@korsolutions/react-native-joystick";

const App = () => {
  const [ws, setWs] = useState(null);
  const [speed, setSpeed] = useState(0);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [isRacing, setIsRacing] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket("ws://192.168.225.240/ws");

    websocket.onopen = () => {
      console.log("Connected to WebSocket server");
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      console.log("Received:", event.data);
    };

    websocket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
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
    const { degree } = data.angle;

    const maxSpeedKmH = 10;
    const ratio = degree / 360;
    const currentSpeed = ratio * maxSpeedKmH;

    setSpeed(currentSpeed);

    // Send speed data to the server
    sendCommand({
      cmd: 1,
      speed: currentSpeed.toFixed(2),
    });
  };

  useEffect(() => {
    if (isRacing && speed > 0) {
      if (!intervalId) {
        const id = setInterval(() => {
          setDistanceTraveled((prevDistance) => prevDistance + speed / 3600);
        }, 1000);
        setIntervalId(id);
      }
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [isRacing, speed]);

  const toggleRace = () => {
    if (isRacing) {
      setIsRacing(false);
    } else {
      setDistanceTraveled(0);
      setIsRacing(true);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#038ac9",
      }}
    >
      <Text>Vitesse : {speed.toFixed(3)} km/h</Text>
      <Text>Distance parcourue : {distanceTraveled.toFixed(3)} km</Text>{" "}
      <Button
        title={isRacing ? "Arrêter la course" : "Commencer la course"}
        onPress={toggleRace}
      />
    </View>
  );
};

export default App;
