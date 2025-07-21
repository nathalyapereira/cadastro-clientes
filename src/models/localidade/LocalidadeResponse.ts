export interface LocalidadePaisesResponse {
  error: boolean;
  msg: string;
  data: Pais[];
}

export interface LocalidadeEstadosResponse {
  error: boolean;
  msg: string;
  data: Pais;
}

export interface Pais {
  name: string;
  iso2: string;
  lat: number;
  long: number;
  states?: Estado[];
}

export interface Estado {
  name: string;
  state_code: string;
}
