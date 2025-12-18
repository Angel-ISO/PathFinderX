import GenericRequest from "../Services/HttpClient";
import toast from "react-hot-toast";

export const fetchRoutesByUser = async (page = 1, size = 10, search = "") => {
  try {
    const params = new URLSearchParams({ page, size });
    if (search) params.append("search", search);

    const response = await GenericRequest.get(`/route/user?${params.toString()}`);
    
    const apiResponse = response.data || response;

    return {
      success: true,
      registers: apiResponse.registers || [],
      data: apiResponse.registers || [], 
      
      total: apiResponse.total || 0,
      pageIndex: apiResponse.pageIndex || page,
      pageSize: apiResponse.pageSize || size,
      totalPages: apiResponse.totalPages || Math.ceil((apiResponse.total || 0) / size),
      search: apiResponse.search || search,
      hasPreviousPage: apiResponse.hasPreviousPage || false,
      hasNextPage: apiResponse.hasNextPage || false,
      
      pagination: {
        currentPage: apiResponse.pageIndex || page,
        pageSize: apiResponse.pageSize || size,
        totalCount: apiResponse.total || 0,
        totalPages: apiResponse.totalPages || Math.ceil((apiResponse.total || 0) / size),
        search: apiResponse.search || search
      }
    };
  } catch (error) {
    console.error("❌ Error en fetchRoutesByUser:", error);
    toast.error(error?.response?.data?.message || "Error al obtener rutas");
    return {
      success: false,
      message: error?.response?.data?.message || "Unexpected error",
      error
    };
  }
};

export const createRoute = async (name, currentDrawPath) => {
  try {
    if (!currentDrawPath?.route?.length) {
      throw new Error("No hay datos de ruta para guardar");
    }

    const body = {
      name,
      route: currentDrawPath.route,
      totalDistance: currentDrawPath.totalDistance
    };

    const response = await GenericRequest.post("/route", body);

    toast.success("Ruta guardada con éxito");

    return { success: true, data: response };
  } catch (error) {
    toast.error(error?.response?.data?.message || "Error al guardar ruta");
    return {
      success: false,
      message: error?.response?.data?.message || "Unexpected error",
      error
    };
  }
};

export const deleteRoute = async (id) => {
  try {
    if (!id) throw new Error("ID de ruta no proporcionado");

    const response = await GenericRequest.delete(`/route/${id}`);

    toast.success("Ruta eliminada");

    return { success: true, data: response };
  } catch (error) {
    toast.error(error?.response?.data?.message || "Error al eliminar ruta");
    return {
      success: false,
      message: error?.response?.data?.message || "Unexpected error",
      error
    };
  }
};