import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import styles from "../styles/TelemetryDataScreenStyle";

const TelemetryDataScreen: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/data");
      const jsonData = await response.json();
      setData(jsonData);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Chargement des données...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Données télémétriques du véhicule</Text>
      {data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>Course n° {item.id}</Text>
              <Text style={styles.itemText}>Vitesse moyenne : {item.avg_speed} km/h</Text>
              <Text style={styles.itemText}>Temps : {item.time} secondes</Text>
              <Text style={styles.itemText}>Distance : {item.distance} mètres</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.text}>Aucune donnée disponible</Text>
      )}
    </View>
  );
};

export default TelemetryDataScreen;
