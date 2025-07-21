import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
  providers: [MessageService],
})
export class App implements OnInit {
  private readonly primeng = inject(PrimeNG);
  private readonly messageService = inject(MessageService);
  protected title = 'cadastro-clientes';

  ngOnInit() {
    this.primeng.ripple.set(true);
  }
}
