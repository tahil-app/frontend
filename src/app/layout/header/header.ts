import { Component, inject } from '@angular/core';
import { SelectLanguage } from '../select-language/select-language';
import { Notification } from "../notification/notification";
import { TranslateModule } from '@ngx-translate/core';
import { getRoleString, UserRoleEnum } from '../../core/enums/user-role.enum';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [SelectLanguage, Notification, TranslateModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  userName = 'جمال عثمان';
  role: UserRoleEnum = UserRoleEnum.Admin;

  private authService = inject(AuthService);
  private router = inject(Router);

  getUserRole(): string {
    return "userRole." + getRoleString(this.role);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
