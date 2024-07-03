import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { indexStyles } from './indexStyles';

export default function Index() {
  return (
    <View style={indexStyles.container}>
      <Image
        source={require('./assets/images/logo_turbotron32.png')}
        style={indexStyles.logo}
      />
      <Text style={indexStyles.text}>Connectez votre véhicule pour commencer</Text>
      <TouchableOpacity
        style={indexStyles.button}
        onPress={() => {
          console.log('Bouton cliqué');
        }}
      >
        <Text style={indexStyles.buttonText}>Commencer</Text>
      </TouchableOpacity>
    </View>
  );
}
