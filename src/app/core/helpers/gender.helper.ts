import { GenderEnum } from "../enums/gender.enum";

export class GenderHelper {
  static get(gender: GenderEnum) {
    return gender === GenderEnum.Male ? 'ذكر' : 'أنثى';
  }
}