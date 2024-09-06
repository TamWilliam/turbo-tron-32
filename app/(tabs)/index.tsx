import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { ReactNativeJoystick } from "@korsolutions/react-native-joystick";
import { TouchableOpacity } from "react-native-gesture-handler";

const App = () => {
  // États pour le joystick de déplacement
  const [joystickCoordsMove, setJoystickCoordsMove] = useState({ x: 0, y: 0 });
  const [dataAngleMove, setDataAngleMove] = useState(0);
  const [distMove, setDistanceMove] = useState(0);
  const [speed, setSpeed] = useState(0);

  // États pour le joystick de caméra
  const [joystickCoordsCamera, setJoystickCoordsCamera] = useState({ x: 0, y: 0 });
  const [dataAngleCamera, setDataAngleCamera] = useState(0);
  const [distCamera, setDistanceCamera] = useState(0);
  const [dataCamera, setDataCamera] = useState([90, 90]);

  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState("Connecting...");
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [isRacing, setIsRacing] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    const connectWebSocket = () => {
      const websocket = new WebSocket("ws://192.168.225.240/ws");

      websocket.onopen = () => {
        console.log("Connected to WebSocket server");
        setWs(websocket);
        setMessage("Connected");
        setReconnectAttempts(0); // Reset on successful connection
      };

      websocket.onmessage = (event) => {
        console.log("Received:", event.data);
      };

      websocket.onclose = () => {
        console.log("Disconnected from WebSocket server");
        setMessage("Disconnected");
        if (reconnectAttempts < 5) {
          setReconnectAttempts(reconnectAttempts + 1);
          setTimeout(connectWebSocket, 2000); // Retry connection after 2 seconds
        } else {
          setMessage("Failed to reconnect after 5 attempts.");
        }
      };

      websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setMessage("Error");
      };

      return () => {
        websocket.close();
      };
    };

    connectWebSocket();
  }, [reconnectAttempts]);

  const sendCommand = (command) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(command));
    }
  };

  // Gestion du joystick de déplacement
  const handleMoveJoystick = (data) => {
    let { x, y } = data.position;
    const { degree, radian } = data.angle;

    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 1.5;

    if (distance > maxDistance) {
      x = maxDistance * Math.cos(radian);
      y = maxDistance * Math.sin(radian);
    }

    setJoystickCoordsMove({ x, y });
    setDataAngleMove(degree);
    setDistanceMove(distance);

    if (distance === 0) {
      setSpeed(0);
    }
  };

  // Gestion du joystick de caméra
  const handleCameraJoystick = (data) => {
    let { x, y } = data.position;
    const { degree, radian } = data.angle;

    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 1.5;

    if (distance > maxDistance) {
      x = maxDistance * Math.cos(radian);
      y = maxDistance * Math.sin(radian);
    }

    setJoystickCoordsCamera({ x, y });
    setDataAngleCamera(degree);
    setDistanceCamera(distance);

    if (distance === 0) {
      setSpeed(0);
    }
  };

  // Interpolation pour le joystick de déplacement
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

  // Interpolation pour le joystick de caméra
  const interpolateDataCamera = (theta) => {
    const lowerIndex = Math.floor(theta / 90);
    const upperIndex = (lowerIndex + 1) % angleDataMapCamera.length;

    const lowerAngle = angleDataMapCamera[lowerIndex].angle;
    const upperAngle = angleDataMapCamera[upperIndex].angle;

    const lowerData = angleDataMapCamera[lowerIndex].data;
    const upperData = angleDataMapCamera[upperIndex].data;

    const ratio = (theta - lowerAngle) / (upperAngle - lowerAngle);

    const interpolatedData = lowerData.map((lowerValue, index) => {
      const upperValue = upperData[index];
      return lowerValue + ratio * (upperValue - lowerValue);
    });

    return interpolatedData;
  };

  // Effet pour envoyer les commandes du joystick de caméra
  useEffect(() => {
    let commandDataCamera = interpolateDataCamera(dataAngleCamera);
    if (distCamera === 0) {
      commandDataCamera = commandDataCamera.map(() => 90);
    } else {
      commandDataCamera = commandDataCamera.map((value) =>
        parseFloat((value).toFixed(2))
      );
    }
    console.log(distCamera);
    console.log(joystickCoordsCamera);
    console.log(dataAngleCamera);
    console.log(commandDataCamera);
    sendCommand({
      cmd: 3,
      data: commandDataCamera,
    });
  }, [joystickCoordsCamera, dataAngleCamera, distCamera]); // Ajoutez toutes les dépendances ici

  // Effet pour envoyer les commandes du joystick de déplacement
  useEffect(() => {
    let commandData = interpolateData(dataAngleMove);
    if (distMove === 0) {
      commandData = commandData.map(() => 0);
    } else {
      commandData = commandData.map((value) =>
        parseFloat((value * (distMove / 1.41)).toFixed(2))
      );
    }
    sendCommand({
      cmd: 1,
      data: commandData,
    });

    // Calcul de la vitesse
    const maxValue = Math.max(...commandData.map(Math.abs));
    const maxSpeedKmH = 10;
    const currentSpeed = (maxValue / 4095) * maxSpeedKmH;
    setSpeed(currentSpeed);
  }, [joystickCoordsMove]);

  // Gestion de la distance parcourue
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
      <Text>{message}</Text>

      <View style={styles.joystickContainer}>
        <ReactNativeJoystick
          onMove={handleMoveJoystick}
          onStop={handleMoveJoystick}
          backgroundColor="#d9d9d9"
          color="#959292"
          radius={75}
        />
        <Text style={styles.joystickLabel}>Joystick Déplacement</Text>
        <Text style={styles.valueText}>
        </Text>
      </View>

      <View style={styles.joystickContainer}>
        <ReactNativeJoystick
          onMove={handleCameraJoystick}
          onStop={handleCameraJoystick}
          backgroundColor="#d9d9d9"
          color="#959292"
          radius={75}
        />
        <Text style={styles.joystickLabel}>Joystick Caméra</Text>
        <Text style={styles.valueText}>
        </Text>
      </View>

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
      </View>

      <TouchableOpacity onPress={toggleRace} style={styles.raceButton}>
        <Text style={styles.buttonText}>{isRacing ? "Stop" : "Start"}</Text>
      </TouchableOpacity>
    </View>
  );
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
  { angle: 360, data: [1000, 1000, -1000, -1000] },
];


const angleDataMapCamera = [
  { angle: 0, data: [0, 180] },
  { angle: 90, data: [90, 180] },
  { angle: 180, data: [180, 90] },
  { angle: 270, data: [90, 90] },
  { angle: 360, data: [0, 90] },
];
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#038ac9",
  },
  joystickContainer: {
    margin: 20,
  },
  joystickLabel: {
    textAlign: "center",
    marginTop: 10,
    color: "#fff",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginVertical: 20,
  },
  circleContainer: {
    alignItems: "center",
  },
  labelText: {
    fontSize: 18,
    color: "#fff",
  },
  circle: {
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  valueText: {
    fontSize: 16,
  },
  raceButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default App;
