import axios from "axios";
const END_POINT = "api/auth/";

class AuthService {
  async login(username: string, password: string) {
    try {
      const res = await axios.post(END_POINT + "login", { username, password });

      this.setToken(res.data.user.token);

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }

  async logout() {
    try {
      const res = await axios.get(END_POINT + "logout");
      delete axios.defaults.headers.common["Authorization"];

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }

  setToken(token: string) {
    localStorage.setItem("token", `Bearer ${token}`);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  async verify() {
    try {
      const res = await axios.get(END_POINT);

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
}

export default new AuthService();
