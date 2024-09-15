import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#038ac9",
    alignItems: "center",
  },
  cameraContainer: {
    height: Dimensions.get("window").height * 0.8,
    width: Dimensions.get("window").width * 0.6,
  },
  joystickContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 50,
    width: 100,
    marginLeft: 50,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    margin: 30,
  },
  circleContainer: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 75,
    borderWidth: 8,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  valueText: {
    fontSize: 30,
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
    width: 100,
    height: 100,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 50,
  },
});

export default styles;
