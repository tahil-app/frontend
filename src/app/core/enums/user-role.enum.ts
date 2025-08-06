export enum UserRoleEnum {
  None,
  Admin,
  Employee,
  Teacher,
  Student
}

export function getRoleString(role: UserRoleEnum): string {
  return UserRoleEnum[role].toString().toLowerCase();
}
