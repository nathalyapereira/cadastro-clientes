import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  ClienteFilter,
  ClienteResponse,
} from '../../../models/cliente/ClienteResponse';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { Cliente } from '../../core/services/cliente/cliente';
import { MessageService } from 'primeng/api';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClienteForm } from '../cliente-form/cliente-form';
import { ConfirmationModal } from '../confirmation-modal/confirmation-modal';
import { TelefonePipe } from '../../shared/pipes/TelefonePipe.pipe';

@Component({
  selector: 'app-cliente-table',
  imports: [
    [
      ReactiveFormsModule,
      FormsModule,
      CommonModule,
      // PrimeNG
      CardModule,
      InputTextModule,
      TableModule,
      ButtonModule,
      ToastModule,
      // Component
      ClienteForm,
      ConfirmationModal,
      // Pipes
      TelefonePipe,
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
  clientesData!: ClienteResponse[];
  filtros = {} as ClienteFilter;
  totalRecords: number = 0;
  first = 0;
  rows = 5;
  public clienteSelecionado = {} as ClienteResponse;
  public metaKey = true;
  loading$: Observable<boolean>;
  displayModal = false;
  displayConfirmationModal = false;
  idCliente: number | undefined;

  constructor() {
    this.loading$ = this.clienteService.loading$;
  }

  ngOnInit(): void {
    this.clienteService.clientes$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => (this.clientesData = data));
    this.clienteService.filtros$
      .pipe(takeUntil(this.destroy$))
      .subscribe((f) => {
        this.filtros = f;
      });
    this.clienteService.paginacao$
      .pipe(takeUntil(this.destroy$))
      .subscribe((p) => {
        this.first = p.page * p.size;
        this.rows = p.size;
      });
    this.clienteService.totalRecords$
      .pipe(takeUntil(this.destroy$))
      .subscribe((t) => {
        this.totalRecords = t;
      });
  }

  filtrar() {
    this.clienteService.atualizarFiltro(this.filtros);
  }

  remover(id: number) {
    this.idCliente = id;
    this.displayConfirmationModal = true;
  }

  onConfirmDelete() {
    console.log('Item deletado com sucesso!');
    this.clienteService.removerCliente(this.idCliente!);
  }

  onCancelDelete() {
    console.log('Operação de delete cancelada.');
  }

  openModal(id?: number) {
    const editar = Boolean(id);

    if (editar) {
      this.idCliente = id;
      console.log('Editando cliente com ID:', this.idCliente);
    } else {
      this.idCliente = undefined;
    }

    this.displayModal = true;
  }

  pageChange({ first, rows }: { first: number; rows: number }) {
    this.first = first;
    this.rows = rows;
    this.clienteService.atualizarPagina({
      page: first === 0 ? 0 : first / rows,
      size: rows,
    });
  }

  //Lifecycle
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
