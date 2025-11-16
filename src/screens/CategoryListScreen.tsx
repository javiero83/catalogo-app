import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { API_URL, API_KEY } from "../config/api";
import { CATEGORY_MAP } from "../config/categories";

type Props = NativeStackScreenProps<RootStackParamList, "CategoryList">;

export default function CategoryListScreen({ navigation }: Props) {
  const [stats, setStats] = useState<Record<string, number>>({});

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/stats`, {
        headers: { "x-api-key": API_KEY }
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error cargando stats:", err);
    }
  };

  useEffect(() => {
  const unsubscribe = navigation.addListener("focus", () => {
    fetchStats(); // <-- ACTUALIZA SIEMPRE
  });

  return unsubscribe;
}, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Categorías</Text>

      {Object.keys(CATEGORY_MAP).map((nombreVisible) => {
        const categoriaReal = CATEGORY_MAP[nombreVisible];

        return (
          <TouchableOpacity
            key={nombreVisible}
            style={styles.card}
            onPress={() =>
              navigation.navigate("Catalogo", { categoria: categoriaReal })
            }
          >
            <Text style={styles.cardTitle}>{nombreVisible}</Text>
            <Text style={styles.cardCount}>
              {stats[categoriaReal] ?? 0} figuras
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  card: {
    padding: 16,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    marginBottom: 12
  },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  cardCount: { marginTop: 6, color: "#555" }
});
