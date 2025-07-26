import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  ClienteFilter,
  ClienteListaStatus,
  ClienteResponse,
  Pagination,
} from '../../../models/cliente/ClienteResponse';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { Cliente } from '../../core/services/cliente/cliente';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ClienteDialog } from '../cliente-dialog/cliente-dialog';

@Component({
  selector: 'app-cliente-table',
  imports: [
    [
      ReactiveFormsModule,
      FormsModule,
      CommonModule,
      // NgxMaskDirective,
      // PrimeNG
      CardModule,
      InputTextModule,
      TableModule,
      ButtonModule,
      ToastModule,
      // RippleModule,
      // InputMaskModule,
      // DatePickerModule,
      // SelectModule,
      // Component
      // ClienteDialog,
    ],
  ],
  templateUrl: './cliente-table.html',
  styleUrl: './cliente-table.css',
  providers: [MessageService],
})
export class ClienteTable implements OnInit, OnDestroy {
  // Injects
  private readonly clienteService = inject(Cliente);
  private readonly messageService = inject(MessageService);

  // Properties
  private readonly destroy$ = new Subject<void>();
  clientesData: ClienteResponse[] = [];
  filtros = {} as ClienteFilter;
  paginacao = {} as Pagination;
  public clienteSelecionado = {} as ClienteResponse;
  public metaKey = true;
  public loading = true;

  ngOnInit(): void {
    this.clienteService.clientes$
      // .pipe(takeUntil(this.destroy$))
      .subscribe((data) => (this.clientesData = data));

    this.clienteService.filtros$.subscribe((f) => {
      this.filtros = f;
    });
    this.clienteService.pagina$.subscribe((p) => {
      this.paginacao = p;
    });
    this.loading = false;
  }

  filtrar() {
    this.clienteService.atualizarFiltro(this.filtros);
  }

  remover(id: number) {
    this.clienteService.remover(id);
  }

  editar(id: number) {
    alert('Editar cliente ' + id);
  }

  novoCliente() {
    alert('Novo cliente');
  }

  //Lifecycle
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
