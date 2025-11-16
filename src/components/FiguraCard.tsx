import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Figura } from "../types";

interface FiguraCardProps {
  figura: Figura;
  onEdit: (figura: Figura) => void;
  onDelete: (id: string) => void;
}

export default function FiguraCard({ figura, onEdit, onDelete }: FiguraCardProps) {
  return (
    <View style={[styles.card, figura.adquirida ? styles.adquirida : styles.noAdquirida]}>
      {figura.imagen ? (
        <Image source={{ uri: figura.imagen }} style={styles.imagen} />
      ) : null}
      <View style={styles.info}>
        <Text style={styles.nombre}>{figura.nombre}</Text>
        <Text style={styles.categoria}>{figura.categoria}</Text>
        <Text style={styles.descripcion}>{figura.descripcion}</Text>
        <Text style={styles.precio}>${figura.precio}</Text>
        <Text style={styles.estadoAdquisicion}>
          {figura.adquirida ? "✅ Adquirida" : "❌ No adquirida"}
        </Text>
      </View>
      <View style={styles.botones}>
        <TouchableOpacity onPress={() => onEdit(figura)} style={styles.botonEditar}>
          <Text style={styles.botonTexto}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(figura._id)} style={styles.botonEliminar}>
          <Text style={styles.botonTexto}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  adquirida: {
    borderLeftWidth: 5,
    borderLeftColor: "green",
  },
  noAdquirida: {
    borderLeftWidth: 5,
    borderLeftColor: "red",
  },
  imagen: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  info: { flex: 1 },
  nombre: { fontSize: 16, fontWeight: "bold" },
  categoria: { fontSize: 14, color: "#555" },
  descripcion: { fontSize: 12, color: "#777" },
  precio: { fontSize: 14, fontWeight: "600", marginTop: 4 },
  estadoAdquisicion: { marginTop: 4, fontWeight: "bold" }, // ✅ propiedad única
  botones: { justifyContent: "space-around" },
  botonEditar: { marginBottom: 4, backgroundColor: "#4caf50", padding: 6, borderRadius: 4 },
  botonEliminar: { backgroundColor: "#f44336", padding: 6, borderRadius: 4 },
  botonTexto: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});

