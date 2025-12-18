import HttpClient from "../Services/HttpClient"
import toast from "react-hot-toast"

export const CalculatePathAct = async (params) => {
  try {
    const response = await HttpClient.post("/path/calculate", params);
    return {
      success: true,
      data: response, 
    };
  } catch (error) {
    toast.error(error?.response?.data?.message || "Error al calcular la ruta");
    return {
      success: false,
      message: error?.response?.data?.message || "Unexpected error",
      error,
    };
  }
};
