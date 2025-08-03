import { Component } from '@angular/core';
import { SelectLanguage } from '../select-language/select-language';
import { Notification } from "../notification/notification";
import { TranslateModule } from '@ngx-translate/core';
import { getRoleString, UserRoleEnum } from '../../core/enums/user-role.enum';

@Component({
  selector: 'app-header',
  imports: [SelectLanguage, Notification, TranslateModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  userName = 'جمال عثمان';
  role: UserRoleEnum = UserRoleEnum.Admin;


  getUserRole(): string {
    return "userRole." + getRoleString(this.role);
  }

}
