import { GenderEnum } from "../enums/gender.enum";
import { UserRoleEnum } from "../enums/user-role.enum";

export class Teacher {
  id: number = 0;
  name!: string;
  phoneNumber!: string;
  email!: string;
  password!: string;
  role: UserRoleEnum = UserRoleEnum.Teacher;
  gender!: GenderEnum;
  joinedDate!: Date;
  birthDate!: Date;
  isActive!: boolean;
}
