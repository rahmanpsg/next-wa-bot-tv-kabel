import axios from "axios";

class UserService {
  public END_POINT: string;

  constructor() {
    this.END_POINT = "user/";
  }

  async get() {
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
      let data: any = { id };
      formData.forEach((value, key) => (data[key] = value));

      const res = await axios.put(this.END_POINT, data);

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
}

export default new UserService();
