import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
  },
  text: {
    fontSize: 18,
    color: "black",
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 5,
  },
  itemText: {
    fontSize: 16,
    color: "black",
  },
});

export default styles;
