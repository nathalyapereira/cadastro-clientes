import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  return next(req).pipe(
    tap((event: any) => {
      if (event.type === 4) {
        const method = req.method;
        let detail = 'Operação realizada com sucesso!';
        if (method === 'POST') detail = 'Criar';
        if (method === 'PUT') detail = 'Atualizar';
        if (method === 'DELETE') detail = 'Deletar';

        messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: detail,
        });
      }
    }),
    // Captura e trata erros
    catchError((error: HttpErrorResponse) => {
      let errorMessage = `Erro ${error.status}: ${
        error.statusText || 'Erro desconhecido'
      }`;
      messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: errorMessage,
      });
      return throwError(() => new Error(errorMessage));
    })
  );
};
