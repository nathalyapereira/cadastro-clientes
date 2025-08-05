import {
  LocalidadeEstadosResponse,
  LocalidadePaisesResponse,
} from '../localidade/LocalidadeResponse';

export interface ClienteResponse {
  id: number;
  nome: string;
  email: string;
  cpf?: string;
  dataNascimento: Date;
  contato: string;
  pais: LocalidadePaisesResponse;
  estado: LocalidadeEstadosResponse;
}

export interface ClienteFilter {
  nome: string | null;
  estado: string | null;
}

export interface Pagination {
  page: number;
  size: number;
}

export interface ClienteListaStatus {
  filtros: ClienteFilter;
  paginacao: Pagination;
}
