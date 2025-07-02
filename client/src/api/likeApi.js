import axios from "./axiosInstance";

export const toggleVideoLike = (id) => axios.post(`/like/likeVideo/${id}`)
