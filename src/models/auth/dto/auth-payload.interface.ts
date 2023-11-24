export interface AuthPayload {
  id: number | string;
  name: null | string;
  email: string;
  roleId: string;
  subscription: boolean;
  registrationDate: Date;
}
