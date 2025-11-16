export type Figura = {
  _id: string;
  nombre: string;
  descripcion?: string;
  precio?: number;
  categoria: string;
  imagen?: string;
  adquirida: boolean;
};

export type RootStackParamList = {
  Menu: undefined;
  CategoryList: undefined;
  Catalogo: { categoria: string };
  FiguraForm: { figura?: Figura } | undefined;
  FiguraDetail: { figura: Figura };
};

