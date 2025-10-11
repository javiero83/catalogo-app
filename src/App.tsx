import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, TextInput, Button, Alert, TouchableOpacity, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";

const API_URL = "https://intramural-apprehensively-delois.ngrok-free.dev/api/figuras";
const API_KEY = "9811924";

interface Figura {
  id: string;
  nombre: string;
  descripcion?: string;
  precio?: number;
  imagen?: string;
  categoria: string;
  adquirida?: boolean;
}

const CATEGORIAS = [
  "myth cloth",
  "vintage",
  "myth cloth ex - poseidon",
  "myth cloth ex - hades",
  "myth cloth ex - bronce",
  "otros",
];

export default function App() {
  const [figuras, setFiguras] = useState<Figura[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Traer figuras
  const fetchFiguras = async () => {
    try {
      const response = await fetch(API_URL, { headers: { "x-api-key": API_KEY } });
      const data = await response.json();
      if (!Array.isArray(data)) return;
      const figurasConId = data.map((f: any) => ({
        id: f._id,
        nombre: f.nombre,
        descripcion: f.descripcion,
        precio: f.precio,
        imagen: f.imagen,
        categoria: f.categoria || "otros",
        adquirida: f.adquirida
      }));
      setFiguras(figurasConId);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudieron cargar las figuras");
    }
  };

  useEffect(() => {
    fetchFiguras();
  }, []);

  // Guardar figura (crear o actualizar)
  const guardarFigura = async () => {
    if (!nombre.trim()) {
      Alert.alert("Atención", "Debes completar el nombre de la figura");
      return;
    }

    try {
      const body = {
        nombre,
        descripcion,
        precio: precio ? Number(precio) : undefined,
        imagen,
        categoria,
        adquirida: false
      };

      let response;
      if (editingId) {
        response = await fetch(`${API_URL}/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
          body: JSON.stringify(body)
        });
      } else {
        response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
          body: JSON.stringify(body)
        });
      }

      const data = await response.json();
      if (data.error) {
        Alert.alert("Error", data.error);
        return;
      }

      if (editingId) {
        setFiguras(figuras.map(f => (f.id === editingId ? { ...f, ...data, id: data._id } : f)));
        setEditingId(null);
      } else {
        setFiguras([...figuras, { ...data, id: data._id }]);
      }

      // Limpiar campos
      cancelarEdicion();

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo guardar la figura");
    }
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setImagen("");
    setCategoria(CATEGORIAS[0]);
    setEditingId(null);
  };

  const eliminarFigura = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "x-api-key": API_KEY }
      });
      const data = await response.json();
      if (data.error) {
        Alert.alert("Error", data.error);
        return;
      }
      setFiguras(figuras.filter(f => f.id !== id));
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo eliminar la figura");
    }
  };

  const toggleAdquirida = async (figura: Figura) => {
    try {
      const response = await fetch(`${API_URL}/${figura.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
        body: JSON.stringify({ adquirida: !figura.adquirida })
      });
      const data = await response.json();
      if (data.error) {
        Alert.alert("Error", data.error);
        return;
      }
      setFiguras(figuras.map(f => (f.id === figura.id ? { ...f, adquirida: data.adquirida } : f)));
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo actualizar la figura");
    }
  };

  const editarFigura = (figura: Figura) => {
    setNombre(figura.nombre);
    setDescripcion(figura.descripcion || "");
    setPrecio(figura.precio?.toString() || "");
    setImagen(figura.imagen || "");
    setCategoria(figura.categoria);
    setEditingId(figura.id);
  };

  // Agrupar por categoría
  const figurasPorCategoria = figuras.reduce((acc: Record<string, Figura[]>, f) => {
    if (!acc[f.categoria]) acc[f.categoria] = [];
    acc[f.categoria].push(f);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Catálogo de Figuras</Text>

      <TextInput placeholder="Nombre" style={styles.input} value={nombre} onChangeText={setNombre} />
      <TextInput placeholder="Descripción" style={styles.input} value={descripcion} onChangeText={setDescripcion} />
      <TextInput placeholder="Precio" style={styles.input} value={precio} onChangeText={setPrecio} keyboardType="numeric" />
      <TextInput placeholder="URL Imagen" style={styles.input} value={imagen} onChangeText={setImagen} />

      {imagen.trim() ? (
        <Image
          source={{ uri: imagen }}
          style={styles.previewImagen}
          onError={() => console.log("URL inválida")}
        />
      ) : null}

      <Picker
        selectedValue={categoria}
        onValueChange={(itemValue) => setCategoria(itemValue)}
        style={{ marginBottom: 10 }}
      >
        {CATEGORIAS.map((cat) => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
        <Button title={editingId ? "Actualizar figura" : "Agregar figura"} onPress={guardarFigura} />
        {editingId && <Button title="Cancelar" onPress={cancelarEdicion} color="#e74c3c" />}
      </View>

      {Object.keys(figurasPorCategoria).map(cat => (
        <View key={cat} style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>{cat}</Text>
          <FlatList
            data={figurasPorCategoria[cat]}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Image
                  source={{ uri: item.imagen ? item.imagen : "https://via.placeholder.com/100?text=No+Image" }}
                  style={styles.imagen}
                />
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>{item.nombre}</Text>
                {item.descripcion ? <Text>{item.descripcion}</Text> : null}
                {item.precio !== undefined ? <Text>Precio: ${item.precio}</Text> : null}
                <Text>Adquirida: {item.adquirida ? "Sí" : "No"}</Text>

                <View style={{ flexDirection: "row", marginTop: 6 }}>
                  <TouchableOpacity style={styles.botonEditar} onPress={() => editarFigura(item)}>
                    <Text style={{ color: "white" }}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.botonEliminar, { marginLeft: 8 }]} onPress={() => eliminarFigura(item.id)}>
                    <Text style={{ color: "white" }}>Eliminar</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={{
                    backgroundColor: item.adquirida ? "#2ecc71" : "#3498db",
                    padding: 6,
                    marginTop: 8,
                    borderRadius: 4,
                    alignItems: "center"
                  }}
                  onPress={() => toggleAdquirida(item)}
                >
                  <Text style={{ color: "white" }}>
                    {item.adquirida ? "Adquirida" : "Marcar como adquirida"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  titulo: { fontSize: 24, fontWeight: "bold", marginTop: 40, marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", marginBottom: 10, padding: 8, borderRadius: 4 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee", borderRadius: 4, marginBottom: 5, backgroundColor: "#fafafa" },
  botonEliminar: { backgroundColor: "#e74c3c", padding: 6, borderRadius: 4, alignItems: "center" },
  botonEditar: { backgroundColor: "#f39c12", padding: 6, borderRadius: 4, alignItems: "center" },
  imagen: { width: 100, height: 100, marginBottom: 6, borderRadius: 4 },
  previewImagen: { width: 100, height: 100, marginBottom: 10, borderRadius: 4, alignSelf: "center" }
});








