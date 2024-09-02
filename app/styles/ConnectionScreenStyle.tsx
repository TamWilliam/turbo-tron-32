import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const isSmallScreen = screenWidth <= 480;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E90FF",
    marginTop: 100,
    padding: 16,
  },
  containerLarge: {
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
    paddingHorizontal: 100,
  },
  containerSmall: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 16,
  },
  formGroup: {
    width: isSmallScreen ? 350 : "40%",
    marginBottom: 20,
  },
  formGroupFirst: {
    marginTop: 30,
  },
  label: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
    backgroundColor: "#FFFFFF", // pour contraster avec le fond bleu
  },
  pickerContainer: {
    paddingVertical: isSmallScreen ? 6 : 0,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
  },
  picker: {
    height: 50,
    width: "100%",
    borderColor: "transparent",
    borderWidth: 0,
    backgroundColor: "transparent",
    overflow: "hidden",
  },

  button: {
    width: isSmallScreen ? 350 : "40%",
    backgroundColor: "#C90073",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  status: {
    marginTop: 20,
    color: "#FFFFFF",
    textAlign: "center",
  },
});

export default styles;
