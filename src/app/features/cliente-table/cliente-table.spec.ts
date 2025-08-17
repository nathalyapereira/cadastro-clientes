import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteTable } from './cliente-table';
import { Cliente } from '../../core/services/cliente/cliente';

describe('ClienteTable', () => {
  let component: ClienteTable;
  let fixture: ComponentFixture<ClienteTable>;
  let clienteService: jasmine.SpyObj<Cliente>;

  beforeEach(async () => {
    const clienteServiceSpy = jasmine.createSpyObj('Cliente', [
      'atualizarFiltro',
      'atualizarPagina',
      'removerCliente',
    ]);
    await TestBed.configureTestingModule({
      imports: [ClienteTable],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
    clienteService = TestBed.inject(Cliente) as jasmine.SpyObj<Cliente>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load clients from the service on ngOnInit', () => {
    fixture.detectChanges();
    expect(component.clientesData.length).toBe(8);
    expect(component.totalRecords).toBe(8);
  });
});
