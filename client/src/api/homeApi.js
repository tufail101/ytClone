import axios from "./axiosInstance";

export const homeAllVideo = () => axios.get(`/video/getAllVideo?page=1&limit=10`)