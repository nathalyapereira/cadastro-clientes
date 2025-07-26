export interface ClienteResponse {
  id: number;
  nome: string;
  email: string;
  cpf?: string;
  dataNascimento: string;
  contato: string;
  pais: string;
  estado: string;
}

export interface ClienteFilter {
  nome: string;
  estado: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
}

export interface ClienteListaStatus {
  filtros: ClienteFilter;
  paginacao: Pagination;
}
