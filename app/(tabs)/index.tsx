import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { ReactNativeJoystick } from "@korsolutions/react-native-joystick";

const App = () => {
  const [joystickCoords, setJoystickCoords] = useState({ x: 0, y: 0 });
  const [joystickCoordsRepere, setJoystickCoordsRepere] = useState({
    x2: 0,
    y2: 0,
  });
  const [dataAngle, setDataAngle] = useState(0);
  const [radian, setRadian] = useState(0);
  const [ws, setWs] = useState(null);
  const [data, setData] = useState([0, 0, 0, 0]);
  const [dist, setDistance] = useState(0);
  const [message, setMessage] = useState("Connecting...");
  const [speed, setSpeed] = useState(0);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [isRacing, setIsRacing] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket("ws://192.168.225.240/ws");

    websocket.onopen = () => {
      console.log("Connected to WebSocket server");
      setWs(websocket);
      setMessage("Connected");
    };

    websocket.onmessage = (event) => {
      console.log("Received:", event.data);
    };

    websocket.onclose = () => {
      console.log("Disconnected from WebSocket server");
      setMessage("Disconnected");
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setMessage("Error");
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

    const distance = Math.sqrt(screenX * screenX + screenY * screenY);
    const maxDistance = 1.5;

    if (distance > maxDistance) {
      screenX = maxDistance * Math.cos(radian);
      screenY = maxDistance * Math.sin(radian);
    }

    screenX = (screenX / maxDistance) * 100;
    screenY = (screenY / maxDistance) * 100;

    setJoystickCoords({ x, y });
    setJoystickCoordsRepere({ x2: screenX, y2: screenY });
    setDataAngle(degree);
    setRadian(radian);
    setDistance(distance);

    if (distance === 0) {
      setSpeed(0);
    }
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
    { angle: 360, data: [1000, 1000, -1000, 1000] },
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
      commandData = commandData.map((value) =>
        parseFloat((value * (dist / 1.41)).toFixed(2))
      );
    }
    setData(commandData);
    sendCommand({
      cmd: 1,
      data: commandData,
    });

    // Calcul de la vitesse
    const maxValue = Math.max(...commandData.map(Math.abs));
    const maxSpeedKmH = 10;
    const currentSpeed = (maxValue / 4095) * maxSpeedKmH;
    setSpeed(currentSpeed);
  }, [joystickCoordsRepere]);

  // Distance parcourue
  useEffect(() => {
    if (isRacing && speed > 0) {
      const id = setInterval(() => {
        setDistanceTraveled((prevDistance) => prevDistance + speed / 3600);
      }, 1000);

      setIntervalId(id);
    } else {
      // Arrêter l'intervalle si la course s'arrête ou si la vitesse est nulle
      clearInterval(intervalId);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
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
      <Text>{message}</Text>
      <ReactNativeJoystick
        onMove={handleJoystickMove}
        onStop={handleJoystickMove}
        backgroundColor="#d9d9d9"
        color="#959292"
        radius={75}
      />
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
