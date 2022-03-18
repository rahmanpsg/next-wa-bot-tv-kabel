import axios from "axios";

class WaService {
  public END_POINT: string;

  constructor() {
    this.END_POINT = "wa/";
  }

  async get() {
    try {
      const res = await axios.get(this.END_POINT);

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }

  async run() {
    try {
      const res = await axios.post(this.END_POINT + "run");

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }

  async stop() {
    try {
      const res = await axios.post(this.END_POINT + "stop");

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
}

export default new WaService();
