import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs';
import {
  ClienteFilter,
  ClienteListaStatus,
  ClienteResponse,
  Pagination,
} from '../../../../models/cliente/ClienteResponse';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Cliente {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly _clientes = new BehaviorSubject<ClienteResponse[]>([]);
  private readonly _filtros = new BehaviorSubject<ClienteFilter>({
    nome: '',
    estado: '',
  } as ClienteFilter);
  private readonly _paginacao = new BehaviorSubject<Pagination>({
    page: 0,
    pageSize: 0,
  } as Pagination);
  private readonly _totalRecords = new BehaviorSubject<number>(0);

  public readonly clientes$ = this._clientes.asObservable();
  public readonly filtros$ = this._filtros.asObservable();
  public readonly totalRecords$ = this._totalRecords.asObservable();
  public readonly pagina$ = this._paginacao.asObservable();

  constructor() {
    this.aplicarFiltro();

    this.activatedRoute.queryParams.subscribe((params) => {
      const savedFiltros = this.loadFiltrosFromStorage?.();
      const savedPaginacao = this.loadPaginacaoFromStorage?.();
      const novoFiltro: ClienteFilter = {
        nome: params['nome'] || savedFiltros?.nome || null,
        estado: params['estado'] || savedFiltros?.estado || null,
      };

      const novaPaginacao: Pagination = {
        page: params['page'] ? +params['page'] : savedPaginacao?.page || 0,
        pageSize: params['pageSize']
          ? +params['pageSize']
          : savedPaginacao?.pageSize || 5,
      };
      this._filtros.next(novoFiltro);
      this._paginacao.next(novaPaginacao);
      this.saveFiltrosToStorage?.(novoFiltro);
      this.savePaginacaoToStorage?.(novaPaginacao);
      this.updateQueryParams(novoFiltro, novaPaginacao);
    });
  }

  private listaTotal: ClienteResponse[] = [
    {
      id: 1,
      nome: 'Ana Souza',
      email: 'ana.souza@email.com',
      cpf: '123.456.789-00',
      dataNascimento: '1990-05-12',
      contato: '(11) 91234-5678',
      pais: 'Brazil',
      estado: 'São Paulo',
    },
    {
      id: 2,
      nome: 'Carlos Mendes',
      email: 'carlos.mendes@email.com',
      cpf: '987.654.321-00',
      dataNascimento: '1985-09-30',
      contato: '(21) 99876-5432',
      pais: 'Brazil',
      estado: 'Rio de Janeiro',
    },
    {
      id: 4,
      nome: 'Lucas Silva',
      email: 'lucas.silva@email.com',
      cpf: '111.222.333-44',
      dataNascimento: '2000-12-01',
      contato: '(31) 98765-4321',
      pais: 'Brazil',
      estado: 'Minas Gerais',
    },
    {
      id: 5,
      nome: 'Sofia Lima',
      email: 'sofia.lima@email.com',
      cpf: '555.666.777-88',
      dataNascimento: '1997-07-17',
      contato: '(41) 91234-8765',
      pais: 'Brazil',
      estado: 'Paraná',
    },
  ];

  private updateQueryParams(
    filtros: ClienteFilter,
    paginacao: Pagination
  ): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page: paginacao.page,
        pageSize: paginacao.pageSize,
        nome: filtros.nome || null,
        estado: filtros.estado || null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private saveFiltrosToStorage(filtros: ClienteFilter): void {
    try {
      localStorage.setItem('clientesFiltros', JSON.stringify(filtros));
      console.log('filtros saved to localStorage:', filtros);
    } catch (e) {
      console.error('Error saving Filtros to localStorage', e);
    }
  }

  private savePaginacaoToStorage(paginacao: Pagination): void {
    try {
      localStorage.setItem('clientesPaginacao', JSON.stringify(paginacao));
      console.log('Paginacao saved to localStorage:', paginacao);
    } catch (e) {
      console.error('Error saving Paginacao to localStorage', e);
    }
  }

  private loadFiltrosFromStorage(): ClienteFilter | null {
    try {
      const savedFiltros = localStorage.getItem('clientesFiltros');
      if (savedFiltros) {
        return JSON.parse(savedFiltros);
      }
    } catch (e) {
      console.error('Error loading Filtros from localStorage', e);
    }
    return null;
  }

  private loadPaginacaoFromStorage(): Pagination | null {
    try {
      const savedPaginacao = localStorage.getItem('clientesPaginacao');
      if (savedPaginacao) {
        return JSON.parse(savedPaginacao);
      }
    } catch (e) {
      console.error('Error loading Paginacao from localStorage', e);
    }
    return null;
  }

  atualizarClientes(clientes: ClienteResponse[]) {
    this._clientes.next(clientes);
  }

  atualizarPagina(paginacao: Pagination): void {
    this._paginacao.next(paginacao);
  }

  atualizarFiltro(filtros: ClienteFilter) {
    this._filtros.next(filtros);
    this.aplicarFiltro();
  }

  private aplicarFiltro(): void {
    const filtro = this._filtros.value;
    const clientesFiltrados = this.listaTotal.filter(
      (cliente) =>
        (!cliente.nome ||
          cliente?.nome?.toLowerCase().includes(filtro.nome?.toLowerCase())) &&
        (!cliente.estado ||
          cliente?.estado?.toLowerCase().includes(filtro.estado?.toLowerCase()))
    );
    this._clientes.next(clientesFiltrados);
  }

  //   remover(id: number) {
  //   this.listaTotal = this.listaTotal.filter((c) => c.id !== id);
  //   this.aplicarFiltro();
  // }

  remover(id: number) {
    this.listaTotal = this.listaTotal.filter((c) => c.id !== id);
    this.aplicarFiltro();
  }
}
