import axios from "axios";

export const loginPost = async (username: string, password: string) => {
    try {
        const res = await axios.post("/api/login", { username, password });

        return res.data;
    } catch (error: any) {
        throw (error.response.data)
    }
};
