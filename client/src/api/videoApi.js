import axios from "./axiosInstance"

export const videoById = (id) => axios.get(`video/getVideoById/${id}`)