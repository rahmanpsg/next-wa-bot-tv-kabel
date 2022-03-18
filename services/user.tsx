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
}

export default new UserService();
