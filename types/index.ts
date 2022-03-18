export type AuthState = {
  authenticated: boolean;
};

export type WaState = {
  run: boolean;
  message: string;
  loading: boolean;
  qr: string | null;
};

export type Users = {
  nik: number;
  nama: string;
  telpon: number;
};

export type UserState = {
  users: Array<Users>;
};

export interface State {
  auth: AuthState;
  wa: WaState;
  user: UserState;
}
