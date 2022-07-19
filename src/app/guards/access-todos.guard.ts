import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccessTodosGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.currentUser.pipe(
      map((user) => {
        /**
         * se user for igual a nulo, não há nenhum usuário logado e a pessoa
         * será redirecionada para a página de login
         */
        if (user == null) {
          return this.router.parseUrl('/auth/login')
        }

        /**
         * se a pessoa está logada, mas ainda não verificou o email dela
         * ela será redirecionada para a página informando que ela precisa
         * verificar o email dela
         */
        if (!user.emailVerified) {
          user.sendEmailVerification()
          this.snackbar.open('Você precisa verificar seu email', 'Ok', {
            duration: 2500,
            verticalPosition: 'top'
          })
          return this.router.parseUrl('/auth/verify-email')
        }

        return true
      })
    )
  }
  
}
