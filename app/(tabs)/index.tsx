import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { ReactNativeJoystick } from "@korsolutions/react-native-joystick";
import { TouchableOpacity } from "react-native-gesture-handler";

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

    // calcul de la vitesse
    const maxValue = Math.max(...commandData.map(Math.abs));
    const maxSpeedKmH = 10;
    const currentSpeed = (maxValue / 4095) * maxSpeedKmH;
    setSpeed(currentSpeed);
  }, [joystickCoordsRepere]);

  // distance parcourue
  useEffect(() => {
    if (isRacing && speed > 0) {
      const id = setInterval(() => {
        setDistanceTraveled((prevDistance) => prevDistance + speed);
      }, 100);

      setIntervalId(id);
    } else {
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
    <View style={styles.container}>
      <View style={styles.joystickContainer}></View>
      <View style={styles.cameraContainer}></View>
      <View style={styles.infoContainer}>
        <View style={styles.circleContainer}>
          <Text style={styles.labelText}>Vitesse</Text>
          <View style={styles.circle}>
            <Text style={styles.valueText}>{speed.toFixed(3)}</Text>
          </View>
        </View>
        <View style={styles.circleContainer}>
          <Text style={styles.labelText}>Distance</Text>
          <View style={styles.circle}>
            <Text style={styles.valueText}>{distanceTraveled.toFixed(3)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.playStopButton} onPress={toggleRace}>
          <Text style={styles.buttonText}>{isRacing ? "❚❚" : "▶"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#038ac9",
  },
  cameraContainer: {
    flex: 2,
    margin: 10,
  },
  joystickContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    marginLeft: 50,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 10,
    marginRight: 10,
  },
  circleContainer: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  valueText: {
    fontSize: 40,
    color: "white",
    fontWeight: "900",
  },
  labelText: {
    fontSize: 28,
    color: "white",
    marginBottom: 8,
  },
  playStopButton: {
    borderWidth: 8,
    borderColor: "white",
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 50,
  },
});

export default App;
