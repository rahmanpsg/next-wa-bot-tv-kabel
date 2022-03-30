import axios from "axios";

class PengaduanService {
  public END_POINT: string;

  constructor() {
    this.END_POINT = "pengaduan/";
  }

  async get(nik: string) {
    try {
      const res = await axios.get(this.END_POINT + nik);

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }

  async getAll() {
    try {
      const res = await axios.get(this.END_POINT);

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
}

export default new PengaduanService();
