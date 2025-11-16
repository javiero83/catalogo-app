import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Button, Image, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, Figura } from "../types";
import { API_URL, API_KEY } from "../config/api";

type Props = NativeStackScreenProps<RootStackParamList, "Catalogo">;

export default function CatalogoScreen({ navigation, route }: Props) {
  const { categoria } = route.params;
  const [figuras, setFiguras] = useState<Figura[]>([]);

  const fetchFiguras = async () => {
    try {
      const res = await fetch(
        `${API_URL}?categoria=${encodeURIComponent(categoria)}`,
        {
          headers: { "x-api-key": API_KEY },
        }
      );
      const data = await res.json();
      setFiguras(data);
    } catch (err) {
      console.error("Error cargando figuras:", err);
    }
  };

  useEffect(() => {
  const unsubscribe = navigation.addListener("focus", () => {
    fetchFiguras(); // refresca siempre al volver
  });

  return unsubscribe;
}, [navigation]);

  const handleEdit = (figura: Figura) => {
    navigation.navigate("FiguraForm", { figura });
  };

  const handleDetail = (figura: Figura) => {
    navigation.navigate("FiguraDetail", { figura });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{categoria.toUpperCase()}</Text>

      <FlatList
        data={figuras}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleDetail(item)}
          >
            <View style={styles.row}>
              {item.imagen ? (
                <Image source={{ uri: item.imagen }} style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, styles.thumbPlaceholder]}>
                  <Text style={styles.thumbPlaceholderText}>Sin img</Text>
                </View>
              )}

              <View style={styles.info}>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.subText}>
                  {item.descripcion || "Sin descripción"}
                </Text>
                <Text style={styles.subText}>
                  Precio: {item.precio != null ? `$ ${item.precio}` : "N/A"}
                </Text>
                <Text style={styles.subText}>
                  {item.adquirida ? "Adquirida" : "Pendiente"}
                </Text>
              </View>
            </View>

            <View style={styles.actions}>
              <Button title="Editar" onPress={() => handleEdit(item)} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  item: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
  },
  row: { flexDirection: "row" },
  thumb: { width: 70, height: 70, borderRadius: 8, marginRight: 10 },
  thumbPlaceholder: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbPlaceholderText: { color: "#555", fontSize: 10 },
  info: { flex: 1 },
  nombre: { fontSize: 16, fontWeight: "bold" },
  subText: { fontSize: 12, color: "#555" },
  actions: { marginTop: 8, alignItems: "flex-end" },
});
