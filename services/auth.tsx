import axios from "axios";
class AuthService {
  public END_POINT: string;

  constructor() {
    this.END_POINT = "auth/";
  }

  async login(username: string, password: string) {
    try {
      const res = await axios.post(this.END_POINT + "login", {
        username,
        password,
      });

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }

  async logout() {
    try {
      const res = await axios.get(this.END_POINT + "logout");
      delete axios.defaults.headers.common["Authorization"];

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }

  async verify() {
    try {
      const res = await axios.get(this.END_POINT);

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
}

export default new AuthService();
