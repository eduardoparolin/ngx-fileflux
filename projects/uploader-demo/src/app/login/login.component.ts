import {Component, inject} from '@angular/core';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {Auth, signInWithEmailAndPassword} from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  imports: [
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatLabel,
    MatButton
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private auth: Auth = inject(Auth);
  emailControl = new FormControl('', Validators.required);
  passwordControl = new FormControl('', Validators.required);

  async login() {
    if (this.emailControl.invalid || this.passwordControl.invalid) {
      return;
    }
    await signInWithEmailAndPassword(this.auth, this.emailControl.value!, this.passwordControl.value!);
  }
}
