import axios from "axios";

class PembayaranService {
  public END_POINT: string;

  constructor() {
    this.END_POINT = "pembayaran/";
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

  async put(id: string, status: boolean) {
    try {
      const res = await axios.put(this.END_POINT, { id, status });

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
}

export default new PembayaranService();
