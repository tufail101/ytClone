import axios from "./axiosInstance";

export const login = (data) => axios.post(`/user/login`,data);
export const logout = () => axios.post(`/user/logout`)