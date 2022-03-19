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
  _id: string;
  nik: number;
  nama: string;
  telpon: number;
  alamat: string;
  createdAt: string;
};

export type UserState = {
  users: Array<Users>;
  message: string | null;
  error: boolean;
  errors: Map<string, string> | null;
};

export interface State {
  authState: AuthState;
  waState: WaState;
  userState: UserState;
}
