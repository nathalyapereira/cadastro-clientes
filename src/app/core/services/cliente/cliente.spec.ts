import { TestBed } from '@angular/core/testing';

import { Cliente } from './cliente';
import { PLATFORM_ID } from '@angular/core';
import * as platform from '@angular/common';

describe('Cliente', () => {
  let service: Cliente;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ Cliente, provide: PLATFORM_ID, useValue: 'browser' }],
    });
    service = TestBed.inject(Cliente);
    spyOn(platform, 'isPlatformBrowser').and.returnValue(true);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
