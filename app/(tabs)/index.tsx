import React, { useEffect, useState, useRef } from "react";
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
  const [isRaceActive, setIsRaceActive] = useState(false); // Nouvel état pour la course
  const [totalDistance, setTotalDistance] = useState(0); // Distance parcourue
  const lastUpdateTimeRef = useRef(Date.now());

  useEffect(() => {
    const websocket = new WebSocket("ws://192.168.225.240/ws"); // à changer selon l'adresse IP affiliée à la voiture

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
    if (dist === 0 || !isRaceActive) {
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

    // calcul vitesse
    const maxValue = Math.max(...commandData.map(Math.abs));
    const maxSpeedKmH = 10;
    const currentSpeed = (maxValue / 4095) * maxSpeedKmH;
    setSpeed(currentSpeed);

    // calcul de la distance parcourue
    const now = Date.now();
    const timeElapsedInSeconds = (now - lastUpdateTimeRef.current) / 1000;
    lastUpdateTimeRef.current = now;

    if (isRaceActive) {
      const distanceTraveled = (currentSpeed * timeElapsedInSeconds) / 3600; // km
      setTotalDistance((prevDistance) => prevDistance + distanceTraveled);
    }
  }, [dataAngle, dist, isRaceActive]);

  const toggleRace = () => {
    if (isRaceActive) {
      // arrête la course
      setIsRaceActive(false);
    } else {
      // lance une course
      setIsRaceActive(true);
      setTotalDistance(0); // reset distance parcourue
      lastUpdateTimeRef.current = Date.now(); // reset temps de référence
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
      <Text>
        Coordonnées du joystick : ({joystickCoords.x.toFixed(2)},{" "}
        {joystickCoords.y.toFixed(2)})
      </Text>
      <Text>
        Coordonnées : ({joystickCoordsRepere.x2.toFixed(2)},{" "}
        {joystickCoordsRepere.y2.toFixed(2)})
      </Text>
      <Text>Angle : ({dataAngle})</Text>
      <Text>Radian : ({radian})</Text>
      <Text>Distance : ({dist.toFixed(2)})</Text>
      <Text>Data : [{data.join(", ")}]</Text>
      <Text>Vitesse : {speed.toFixed(2)} km/h</Text>
      <Text>Distance parcourue : {totalDistance.toFixed(2)} km</Text>{" "}
      <Button
        title={isRaceActive ? "Arrêter la course" : "Commencer la course"}
        onPress={toggleRace}
      />
    </View>
  );
};

export default App;
