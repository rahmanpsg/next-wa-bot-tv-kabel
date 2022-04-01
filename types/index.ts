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
  aktif: boolean;
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
  bulan: Array<string>;
  createdAt: string;
};

export type PembayaranState = {
  pembayarans: Array<Pembayarans>;
  message: string | null;
  error: boolean;
};

export type Rekenings = {
  _id: string;
  nama: string;
  nomor: number;
};

export type RekeningState = {
  rekenings: Array<Rekenings>;
  message: string | null;
  error: boolean;
  errors: Map<string, string> | null;
};

export interface State {
  authState: AuthState;
  waState: WaState;
  userState: UserState;
  pengaduanState: PengaduanState;
  pembayaranState: PembayaranState;
  rekeningState: RekeningState;
}
