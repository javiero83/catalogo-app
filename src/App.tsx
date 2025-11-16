import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { RootStackParamList } from "./types";

import MenuScreen from "./screens/MenuScreen";
import CategoryListScreen from "./screens/CategoryListScreen";
import CatalogoScreen from "./screens/CatalogoScreen";
import FiguraFormScreen from "./screens/FiguraFormScreen";
import FiguraDetailScreen from "./screens/FiguraDetailScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">

        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{ title: "Saint Seiya App" }}
        />

        <Stack.Screen
          name="CategoryList"
          component={CategoryListScreen}
          options={{ title: "Categorías" }}
        />

        <Stack.Screen
          name="Catalogo"
          component={CatalogoScreen}
          options={({ route }) => ({
            title: `Catálogo: ${route.params.categoria}`,
          })}
        />

        <Stack.Screen
          name="FiguraForm"
          component={FiguraFormScreen}
          options={{ title: "Figura" }}
        />

        <Stack.Screen
          name="FiguraDetail"
          component={FiguraDetailScreen}
          options={{ title: "Detalle de figura" }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
