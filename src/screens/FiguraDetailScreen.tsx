import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Button,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, Figura } from "../types";
import { API_URL, API_KEY } from "../config/api";

type Props = NativeStackScreenProps<RootStackParamList, "FiguraDetail">;

export default function FiguraDetailScreen({ route, navigation }: Props) {
  const { figura } = route.params;
  const [estado, setEstado] = useState(figura.adquirida);

  const toggleEstado = async () => {
    const nuevoEstado = !estado;

    try {
      await fetch(`${API_URL}/${figura._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({ adquirida: nuevoEstado }),
      });

      setEstado(nuevoEstado);
      Alert.alert(
        "Estado actualizado",
        nuevoEstado ? "Marcada como adquirida" : "Marcada como pendiente"
      );
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo actualizar el estado");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {figura.imagen ? (
        <Image source={{ uri: figura.imagen }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.noImageBox]}>
          <Text style={styles.noImageText}>Sin imagen</Text>
        </View>
      )}

      <Text style={styles.name}>{figura.nombre}</Text>

      <View style={styles.badgesRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>Categoría</Text>
          <Text style={styles.badgeValue}>{figura.categoria}</Text>
        </View>

        <View
          style={[
            styles.badge,
            estado ? styles.badgeAdquirida : styles.badgeNoAdquirida,
          ]}
        >
          <Text style={styles.badgeLabel}>Estado</Text>
          <Text style={styles.badgeValue}>
            {estado ? "Adquirida" : "Pendiente"}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Precio</Text>
        <Text style={styles.sectionText}>
          {figura.precio != null ? `$ ${figura.precio}` : "N/A"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.sectionText}>
          {figura.descripcion || "Sin descripción"}
        </Text>
      </View>

      {/* BOTÓN PARA ACTUALIZAR ESTADO */}
      <Button
        title={estado ? "Marcar como pendiente" : "Marcar como adquirida"}
        onPress={toggleEstado}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: "center", backgroundColor: "#0b0b16" },
  image: {
    width: "100%",
    height: 280,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#111",
  },
  noImageBox: { justifyContent: "center", alignItems: "center" },
  noImageText: { color: "#888" },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f5f5f5",
    marginBottom: 12,
    textAlign: "center",
  },
  badgesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  badge: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#222",
    marginHorizontal: 4,
  },
  badgeAdquirida: { backgroundColor: "#1b5e20" },
  badgeNoAdquirida: { backgroundColor: "#5d4037" },
  badgeLabel: { fontSize: 12, color: "#ccc" },
  badgeValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 4,
  },
  section: {
    width: "100%",
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#151521",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f5f5f5",
    marginBottom: 6,
  },
  sectionText: { color: "#ddd", fontSize: 14 },
});
