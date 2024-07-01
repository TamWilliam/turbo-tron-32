import { StyleSheet } from 'react-native';

export const indexStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  logo: {
    width: 350,
    height: 200,
  },
  text: {
    color: '#C90073',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#C90073',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
