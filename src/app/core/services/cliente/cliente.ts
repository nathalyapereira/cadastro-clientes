import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  delay,
  distinctUntilChanged,
  map,
  Observable,
  of,
  startWith,
  tap,
} from 'rxjs';
import {
  ClienteFilter,
  ClienteResponse,
  Pagination,
} from '../../../../models/cliente/ClienteResponse';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Cliente {
  //Injects
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly _filtros = new BehaviorSubject<ClienteFilter>({
    nome: null,
    estado: null,
  });
  private readonly _paginacao = new BehaviorSubject<Pagination>({
    page: 0,
    size: 5,
  });
  private readonly _totalRecords = new BehaviorSubject<number>(0);
  private readonly _loading = new BehaviorSubject<boolean>(true);

  private readonly _stateUpdates$ = combineLatest([
    this._filtros.pipe(
      distinctUntilChanged(
        (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
      )
    ),
    this._paginacao.pipe(
      distinctUntilChanged(
        (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
      )
    ),
  ]);

  public readonly clientes$ = new BehaviorSubject<ClienteResponse[]>([]);
  public readonly filtros$ = this._filtros.asObservable();
  public readonly totalRecords$ = this._totalRecords.asObservable();
  public readonly paginacao$ = this._paginacao.asObservable();
  public readonly loading$ = this._loading.asObservable();

  private listaTotal: ClienteResponse[] = [
    {
      id: 1,
      nome: 'Ana Souza',
      email: 'ana.souza@email.com',
      cpf: '780.668.440-93',
      dataNascimento: new Date('1990-05-12'),
      contato: '(11) 91234-5678',
      pais: {
        id: 31,
        name: 'Brazil',
        iso2: 'BR',
        iso3: 'BRA',
        phonecode: '55',
        capital: 'Brasilia',
        currency: 'BRL',
        native: 'Brasil',
        emoji: '🇧🇷',
      },
      estado: {
        id: 2021,
        name: 'São Paulo',
        iso2: 'SP',
      },
    },
    {
      id: 2,
      nome: 'Carlos Mendes',
      email: 'carlos.mendes@email.com',
      cpf: '987.654.321-00',
      dataNascimento: new Date('1985-09-30'),
      contato: '(21) 99876-5432',
      pais: {
        id: 31,
        name: 'Brazil',
        iso2: 'BR',
        iso3: 'BRA',
        phonecode: '55',
        capital: 'Brasilia',
        currency: 'BRL',
        native: 'Brasil',
        emoji: '🇧🇷',
      },
      estado: {
        id: 1997,
        name: 'Rio de Janeiro',
        iso2: 'RJ',
      },
    },
    {
      id: 3,
      nome: 'Beatriz Costa',
      email: 'bia.costa@email.com',
      cpf: '520.894.100-78',
      dataNascimento: new Date('1992-03-15'),
      contato: '(85) 98765-1234',
      pais: {
        id: 31,
        name: 'Brazil',
        iso2: 'BR',
        iso3: 'BRA',
        phonecode: '55',
        capital: 'Brasilia',
        currency: 'BRL',
        native: 'Brasil',
        emoji: '🇧🇷',
      },
      estado: {
        id: 2016,
        name: 'Ceará',
        iso2: 'CE',
      },
    },
    {
      id: 4,
      nome: 'Lucas Silva',
      email: 'lucas.silva@email.com',
      cpf: '614.325.980-15',
      dataNascimento: new Date('2000-12-01'),
      contato: '(31) 98765-4321',
      pais: {
        id: 31,
        name: 'Brazil',
        iso2: 'BR',
        iso3: 'BRA',
        phonecode: '55',
        capital: 'Brasilia',
        currency: 'BRL',
        native: 'Brasil',
        emoji: '🇧🇷',
      },
      estado: {
        id: 1998,
        name: 'Minas Gerais',
        iso2: 'MG',
      },
    },
    {
      id: 5,
      nome: 'Sofia Lima',
      email: 'sofia.lima@email.com',
      cpf: '905.407.680-14',
      dataNascimento: new Date('1997-07-17'),
      contato: '(41) 91234-8765',
      pais: {
        id: 31,
        name: 'Brazil',
        iso2: 'BR',
        iso3: 'BRA',
        phonecode: '55',
        capital: 'Brasilia',
        currency: 'BRL',
        native: 'Brasil',
        emoji: '🇧🇷',
      },
      estado: {
        id: 2022,
        name: 'Paraná',
        iso2: 'PR',
      },
    },
    {
      id: 6,
      nome: 'Gabriel Oliveira',
      email: 'gabriel.oliver@email.com',
      cpf: '670.633.020-51',
      dataNascimento: new Date('1993-11-25'),
      contato: '(11) 97654-3210',
      pais: {
        id: 31,
        name: 'Brazil',
        iso2: 'BR',
        iso3: 'BRA',
        phonecode: '55',
        capital: 'Brasilia',
        currency: 'BRL',
        native: 'Brasil',
        emoji: '🇧🇷',
      },
      estado: {
        id: 2021,
        name: 'São Paulo',
        iso2: 'SP',
      },
    },
    {
      id: 7,
      nome: 'Mariana Santos',
      email: 'mari.santos@email.com',
      cpf: '612.233.770-67',
      dataNascimento: new Date('1988-01-08'),
      contato: '(21) 91122-3344',
      pais: {
        id: 31,
        name: 'Brazil',
        iso2: 'BR',
        iso3: 'BRA',
        phonecode: '55',
        capital: 'Brasilia',
        currency: 'BRL',
        native: 'Brasil',
        emoji: '🇧🇷',
      },
      estado: {
        id: 1997,
        name: 'Rio de Janeiro',
        iso2: 'RJ',
      },
    },
    {
      id: 8,
      nome: 'Fernanda Martins',
      email: 'fer.martins@email.com',
      cpf: '790.937.360-00',
      dataNascimento: new Date('1995-04-03'),
      contato: '(31) 95566-7788',
      pais: {
        id: 31,
        name: 'Brazil',
        iso2: 'BR',
        iso3: 'BRA',
        phonecode: '55',
        capital: 'Brasilia',
        currency: 'BRL',
        native: 'Brasil',
        emoji: '🇧🇷',
      },
      estado: {
        id: 1998,
        name: 'Minas Gerais',
        iso2: 'MG',
      },
    },
  ];

  constructor() {
    this.activatedRoute.queryParams
      .pipe(
        map((params) => {
          const savedFiltros = this.loadFiltrosFromStorage();
          const savedPaginacao = this.loadPaginacaoFromStorage();

          const filtros: ClienteFilter = {
            nome: params['nome'] || savedFiltros?.nome || null,
            estado: params['estado'] || savedFiltros?.estado || null,
          };

          const paginacao: Pagination = {
            page: params['page'] ? +params['page'] : savedPaginacao?.page || 0,
            size: params['size'] ? +params['size'] : savedPaginacao?.size || 5,
          };
          return { filtros, paginacao };
        }),
        startWith({
          filtros: this.loadFiltrosFromStorage() || {
            nome: null,
            estado: null,
          },
          paginacao: this.loadPaginacaoFromStorage() || {
            page: 0,
            size: 5,
          },
        })
      )
      .subscribe(({ filtros, paginacao }) => {
        setTimeout(() => {
          this._filtros.next(filtros);
          this._paginacao.next(paginacao);
        }, 0);
      });

    this._stateUpdates$
      .pipe(
        debounceTime(100),
        tap(() => this._loading.next(true)),
        tap(([filtros, paginacao]) => {
          this.updateQueryParams(filtros, paginacao);
          this.saveFiltrosToStorage(filtros);
          this.savePaginacaoToStorage(paginacao);
        }),
        map(([filtros, paginacao]) =>
          this.aplicarFiltroLocal(filtros, paginacao)
        )
      )
      .subscribe(([clientesFiltrados, totalRecords]) => {
        this.clientes$.next(clientesFiltrados);
        this._totalRecords.next(totalRecords);
        this._loading.next(false);
      });
  }

  private updateQueryParams(
    filtros: ClienteFilter,
    paginacao: Pagination
  ): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page: paginacao.page,
        size: paginacao.size,
        nome: filtros.nome || null,
        estado: filtros.estado || null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private saveFiltrosToStorage(filtros: ClienteFilter): void {
    if (this.isBrowser) {
      try {
        localStorage.setItem('clientesFiltros', JSON.stringify(filtros));
      } catch (e) {
        console.error('Erro ao salvar filtros no localStorage', e);
      }
    }
  }

  private savePaginacaoToStorage(paginacao: Pagination): void {
    if (this.isBrowser) {
      try {
        localStorage.setItem('clientesPaginacao', JSON.stringify(paginacao));
      } catch (e) {
        console.error('Erro ao salvar paginação no localStorage', e);
      }
    }
  }

  private loadFiltrosFromStorage(): ClienteFilter | null {
    if (this.isBrowser) {
      try {
        const savedFiltros = localStorage.getItem('clientesFiltros');
        if (savedFiltros) {
          return JSON.parse(savedFiltros);
        }
      } catch (e) {
        console.error('Erro ao carregar filtros do localStorage', e);
      }
    }
    return null;
  }

  private loadPaginacaoFromStorage(): Pagination | null {
    if (this.isBrowser) {
      try {
        const savedPaginacao = localStorage.getItem('clientesPaginacao');
        if (savedPaginacao) {
          return JSON.parse(savedPaginacao);
        }
      } catch (e) {
        console.error('Erro ao carregar paginação do localStorage', e);
      }
    }
    return null;
  }

  atualizarPagina(paginacao: Pagination): void {
    this._paginacao.next(paginacao);
  }

  atualizarFiltro(filtros: ClienteFilter): void {
    const currentFiltros = this._filtros.getValue();
    const newFiltros = { ...currentFiltros, ...filtros };
    this._filtros.next(newFiltros);
    const currentPaginacao = this._paginacao.getValue();
    this._paginacao.next({ ...currentPaginacao, page: 0 });
  }

  private aplicarFiltroLocal(
    filtro: ClienteFilter,
    paginacao: Pagination
  ): [ClienteResponse[], number] {
    let clientesResultados = [...this.listaTotal];

    if (filtro.nome) {
      const termoNome = filtro.nome.toLowerCase().trim();
      clientesResultados = clientesResultados.filter((cliente) =>
        cliente.nome?.toLowerCase().includes(termoNome)
      );
    }

    if (filtro.estado) {
      const termoEstado = filtro.estado.toLowerCase().trim();
      clientesResultados = clientesResultados.filter((cliente) =>
        cliente.estado.name?.toLowerCase().includes(termoEstado)
      );
    }

    const totalFilteredRecords = clientesResultados.length;

    const start = paginacao.page * paginacao.size;
    const end = start + paginacao.size;
    const clientesPaginados = clientesResultados.slice(start, end);

    return [clientesPaginados, totalFilteredRecords];
  }

  obterClientePorId(id: number): Observable<ClienteResponse> {
    const cliente = this.listaTotal.find((c) => c.id === id)!;
    return of(cliente).pipe(delay(300));
  }

  salvarCliente(cliente: ClienteResponse): void {
    this._loading.next(true);

    if (cliente.id) {
      const index = this.listaTotal.findIndex((c) => c.id === cliente.id);
      if (index > -1) {
        this.listaTotal[index] = cliente;
      }
    } else {
      cliente.id = Math.max(...this.listaTotal.map((c) => c.id)) + 1;
      this.listaTotal.push(cliente);
    }
    const [clientesPaginados, totalFilteredRecords] = this.aplicarFiltroLocal(
      this._filtros.getValue(),
      this._paginacao.getValue()
    );
    this.clientes$.next(clientesPaginados);
    this._totalRecords.next(totalFilteredRecords);

    this._loading.next(false);
  }

  removerCliente(id: number): void {
    this._loading.next(true);

    this.listaTotal = this.listaTotal.filter((c) => c.id !== id);
    this.clientes$.next(this.listaTotal);
    this._totalRecords.next(this.listaTotal.length);

    const [clientesPaginados, totalFilteredRecords] = this.aplicarFiltroLocal(
      this._filtros.getValue(),
      this._paginacao.getValue()
    );
    this.clientes$.next(clientesPaginados);
    this._totalRecords.next(totalFilteredRecords);
    this._loading.next(false);
  }
}
