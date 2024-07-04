import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  logo: {
    width: 350,
    height: 200,
    marginBottom: 20,
  },
  text: {
    color: "#C90073",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#C90073",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default styles;
