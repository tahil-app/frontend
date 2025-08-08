import { GenderEnum } from "../enums/gender.enum";
import { UserRoleEnum } from "../enums/user-role.enum";
import { Attachment } from "./attachment.model";
import { Group } from "./group.model";

export class Student {
  id: number = 0;
  name!: string;
  phoneNumber!: string;
  email!: string;
  password!: string;
  role: UserRoleEnum = UserRoleEnum.Student;
  gender!: GenderEnum;
  joinedDate!: string | null;
  birthDate!: string | null;
  isActive!: boolean;
  imagePath!: string;

  qualification!: string;
  attachments!: Attachment[];
  groups!: Group[];
}
