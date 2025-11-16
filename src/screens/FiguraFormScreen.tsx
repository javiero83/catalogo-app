import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Switch,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, Figura } from "../types";
import { CATEGORY_MAP } from "../config/categories";
import { API_URL, API_KEY } from "../config/api";

type Props = NativeStackScreenProps<RootStackParamList, "FiguraForm">;

export default function FiguraFormScreen({ route, navigation }: Props) {
  const figura = route.params?.figura;

  // ESTADOS
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState(Object.values(CATEGORY_MAP)[0]);
  const [imagen, setImagen] = useState("");
  const [adquirida, setAdquirida] = useState(false);

  // CARGA DATOS AL EDITAR
  useEffect(() => {
    if (figura) {
      setNombre(figura.nombre);
      setDescripcion(figura.descripcion || "");
      setPrecio(figura.precio?.toString() || "");
      setCategoria(figura.categoria);
      setImagen(figura.imagen || "");
      setAdquirida(!!figura.adquirida);
    }
  }, [figura]);

  // GUARDAR
  const handleSave = async () => {
    if (!nombre) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }

    const payload = {
      nombre,
      descripcion,
      precio: Number(precio),
      categoria,
      imagen,
      adquirida: adquirida === true, // ← IMPORTANTE: enviar siempre
    };

    try {
      if (figura) {
        // EDITAR
        await fetch(`${API_URL}/${figura._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
          body: JSON.stringify(payload),
        });
      } else {
        // CREAR
        await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
          body: JSON.stringify(payload),
        });
      }

      navigation.goBack();
    } catch (err) {
      console.error("Error guardando:", err);
      Alert.alert("Error", "No se pudo guardar la figura");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre:</Text>
      <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={styles.input}
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <Text style={styles.label}>Precio:</Text>
      <TextInput
        style={styles.input}
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Categoría:</Text>
      <Picker
        selectedValue={categoria}
        onValueChange={setCategoria}
        style={styles.picker}
      >
        {Object.values(CATEGORY_MAP).map((cat) => (
          <Picker.Item key={cat} value={cat} label={cat} />
        ))}
      </Picker>

      <Text style={styles.label}>URL Imagen:</Text>
      <TextInput style={styles.input} value={imagen} onChangeText={setImagen} />

      {/* SWITCH ADQUIRIDA */}
      <View style={styles.switchRow}>
        <Text style={styles.switchText}>Adquirida:</Text>
        <Switch value={adquirida} onValueChange={setAdquirida} />
      </View>

      <Button title="Guardar" onPress={handleSave} />
    </View>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  label: { marginTop: 12, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  picker: { marginTop: 4 },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    paddingVertical: 6,
  },
  switchText: {
    fontSize: 16,
    marginRight: 10,
  },
});
