import { GenderEnum } from "../enums/gender.enum";
import { UserRoleEnum } from "../enums/user-role.enum";
import { Attachment } from "./attachment.model";

export class Teacher {
  id: number = 0;
  name!: string;
  phoneNumber!: string;
  email!: string;
  password!: string;
  role: UserRoleEnum = UserRoleEnum.Teacher;
  gender!: GenderEnum;
  joinedDate!: string;
  birthDate!: string;
  isActive!: boolean;
  imagePath!: string;

  qualification!: string;
  experience!: string;
  attachments!: Attachment[];
}
