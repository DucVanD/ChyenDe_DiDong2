// import axios from "axios";

// // 🔥 QUAN TRỌNG: Dùng địa chỉ IP thật của máy (lấy từ ipconfig)
// // Không dùng 'localhost' nếu test trên điện thoại/Expo Go.
// // Theo ảnh cmd của bạn, IP là: 10.217.155.87
// const IP_ADDRESS = "10.217.155.87"; 
// const PORT = "8080";

// const httpAxios = axios.create({
//     baseURL: `http://${IP_ADDRESS}:${PORT}/api`, 
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// export default httpAxios;


import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, STORAGE_KEYS } from "../config/api.config";

// Use the central API_BASE_URL (same source of truth as ENDPOINTS)
// Add a timeout to fail faster and show clearer error messages during development
const httpAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ========================================
// REQUEST INTERCEPTOR - Attach JWT Token
// ========================================
httpAxios.interceptors.request.use(
  async (config) => {
    try {
      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

      // If token exists, attach it to the Authorization header
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error retrieving token from storage:", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default httpAxios;
