import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/common/data-types/users';
import { UserService } from 'src/app/common/services/user.service';
import { LoginService } from 'src/app/common/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  form: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder, private userService: UserService, private loginService: LoginService) {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, ]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirm: ['', [Validators.required, Validators.minLength(8)]],
    },
    {
      validator: this.confirmPasswordValidation
    });
  }

  ngOnInit(): void {
  }

  signUp(){
    if(this.form.valid){
      let newUser = this.form.value;
      delete newUser.confirm;

      this.userService.createUser(newUser);

      delete newUser.username;

      this.loginService.login(newUser);
      
      this.router.navigate(['']);
    }
  }

  confirmPasswordValidation(form: FormGroup) {
    return form.controls['password'].value === form.controls['confirm'].value ? true : {'mismatch': true};
  }
}
