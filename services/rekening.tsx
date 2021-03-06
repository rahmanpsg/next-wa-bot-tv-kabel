import axios from "axios";

class RekeningService {
  public END_POINT: string;

  constructor() {
    this.END_POINT = "rekening/";
  }

  async getAll() {
    try {
      const res = await axios.get(this.END_POINT);

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }

  async post(formData: FormData) {
    try {
      let data: any = {};
      formData.forEach((value, key) => (data[key] = value));

      const res = await axios.post(this.END_POINT, data);

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }

  async put(formData: FormData, id: string) {
    try {
      let data: any = {};
      formData.forEach((value, key) => (data[key] = value));

      const res = await axios.put(this.END_POINT + id, data);

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }

  async delete(id: string) {
    try {
      const res = await axios.delete(this.END_POINT + id);

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
}

export default new RekeningService();
