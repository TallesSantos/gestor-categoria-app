export interface UserPreferences {
  id: number;
  primary_color_header: string;
  secondary_color_header: string;
  primary_color: string;
  secondary_color: string;
  column_min_width: number;
  column_min_heigth: number;
}

export interface UserPreferenceSizes {
  width: number;
  minHeigth: number;
  padding: number;
}

export type Languages = "br" | "eng";

export const plataformLanguages = {
  name: { eng: "name", br: "nome" },
  price: { eng: "price", br: "preço" },
  description: { eng: "description", br: "descrição" },
  canotOpenLink: {
    eng: "Cannot open link",
    br: "Não foi possivel abrir o link: ",
  },
  editPreferenceTitle: {
    eng: "Edit table preferences",
    br: "Edite as preferencias da tabela:",
  },
  MinHeigth: { eng: "minimal heigth", br: "Altura minima" },
  width: { eng: "width", br: "largura" },
  primaryColorHeader: {
    eng: "Primary color of header table",
    br: "Cor primaria do título da tabela",
  },
  secondaryColorHeader: {
    eng: "Secondary color of header table",
    br: "Cor secundaria do título da tabela",
  },
  primaryColor: {
    eng: "Primary color of body table",
    br: "Cor primaria do corpo da tabela",
  },
  secondaryColor: {
    eng: "Secondary color of body table",
    br: "Cor secundaria do corpo da tabela",
  },
  insertCategoryTitle: {
    eng: "Create aditional column to category (name, price, description are build automaticaly)",
    br: "Crie colunas adicionais para a categoria (nome, preço, descrição são criadas automaticamente)",
  },
  extraColumnName: {
    br: "Nome da coluna extra",
    eng: "Name of extra column",
  },
  add: {
    br: "Adicionar",
    eng: "Add",
  },
  cancel: { br: "Cancelar", eng: "Cancel" },
  insert: { br: "Inserir", eng: "Insert" },
  insertRegistryTitle: {
    br: "Adicione as informações nas respectivas colunas",
    eng: "Add info about respective column",
  },
};
