import { formatDate } from "@angular/common";

export class DataHelper {
  static toDate(date: string) {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  static getAge(birthDate: string) {
    const today = new Date();
    const _birthDate = new Date(birthDate);
    let age = today.getFullYear() - _birthDate.getFullYear();
    const m = today.getMonth() - _birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < _birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
