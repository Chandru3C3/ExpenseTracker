import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService, RegisterRequest } from '../../../services/auth.service';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  userData: RegisterRequest = {
    username: '',
    email: '',
    password: '',
    fullName: ''
  };
  
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onSubmit(): void {
  this.loading = true;
  
  // FIX: Change 'registerRequest' to 'this.userData'
  this.authService.register(this.userData).subscribe({ 
    
    next: (response: any) => { 
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registration successful' });
      this.router.navigate(['/login']);
    },
    
    error: (error: any) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Registration failed' });
    }
  });
}

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
