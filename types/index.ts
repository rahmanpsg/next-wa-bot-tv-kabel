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

export type Pengaduans = {
  _id: string;
  user: Users;
  pengaduan: string;
  createdAt: string;
};

export type PengaduanState = {
  pengaduans: Array<Pengaduans>;
};

export type Pembayarans = {
  _id: string;
  user: Users;
  foto: string;
  status: boolean;
  bulan: Array<number>;
  createdAt: string;
};

export type PembayaranState = {
  pembayarans: Array<Pembayarans>;
  message: string | null;
  error: boolean;
};

export interface State {
  authState: AuthState;
  waState: WaState;
  userState: UserState;
  pengaduanState: PengaduanState;
  pembayaranState: PembayaranState;
}
