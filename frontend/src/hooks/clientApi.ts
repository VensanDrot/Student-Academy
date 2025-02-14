import axios from "axios";
import Cookies from "js-cookie";
 
export const apiClientFormData = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

apiClientFormData.interceptors.request.use(
  async (config) => {
    let accessToken = Cookies.get("access");
     
    if (!accessToken) {
      return config;
    } 
    config.headers.set("x-access-token", accessToken)
    config.headers.set("Accept-Language", Cookies.get('language'))
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);


export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

 

apiClient.interceptors.request.use(
  async (config) => {
    let accessToken = Cookies.get("access");

    if (!accessToken) {
      return config;
    }

    !config?.headers?.get("x-access-token") && config.headers.set("x-access-token", accessToken)
    config.headers.set("Accept-Language", Cookies.get('language'))
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// //refresh token

// apiClient.interceptors.response.use(
//   (response) => response, // Pass through the response if no errors
//   async (error) => {
//     const originalRequest = error.config;

//     console.log(error);

//     // Check if error status is 401 and originalRequest hasn't been retried yet
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; // Mark the request as retrying

//       try {
//         // Request a new access token using the refresh token
//         const refreshResponse = await axios.post(
//           `${process.env.REACT_APP_BACKEND_URL}/refresh`, // Your refresh token endpoint
//           {}, // Send an empty body or any required payload
//           {
//             headers: {
//               "x-refresh-token": Cookies.get("refresh"), // Use the refresh token stored in cookies
//             },
//           }
//         );

//         // Check if the refresh was successful
//         if (refreshResponse?.data?.access_token && refreshResponse?.data?.refresh_token) {
//           // Update cookies with the new tokens
//           Cookies.set("access", refreshResponse?.data?.access_token, { secure: true });
//           Cookies.set("refresh", refreshResponse?.data?.refresh_token, { secure: true });

//           // Retry the original request with the new access token
//           originalRequest.headers["x-access-token"] = refreshResponse?.data?.access_token;
//           return axios(originalRequest);
//         } else {
//           throw new Error("Refresh token response invalid.");
//         }
//       } catch (refreshError) {
//         console.error("Refresh token failed:", refreshError);

//         // If refresh fails, clear cookies and redirect to login
//         Cookies.remove("access");
//         Cookies.remove("refresh");
//         window.location.href = "/login"; // Adjust to your login route
//         return Promise.reject(refreshError);
//       }
//     }

//     // Reject other errors
//     return Promise.reject(error);
//   }
// );
