import HttpClient from "../Services/HttpClient"
import toast from "react-hot-toast"
import {jwtDecode} from "jwt-decode"


export const GetCurrentUserAct = async () => {
  try {
    const token = window.localStorage.getItem("token")
    if (!token) throw new Error("No token found")

    const decoded = jwtDecode(token)
    const userId = decoded?.userId || null

    if (!userId) throw new Error("User ID not found in token")

    const userData = await HttpClient.get(`/user/${userId}`)

    return { success: true, data: userData }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Error al obtener el usuario")
    return {
      success: false,
      message: error.response?.data?.message || "Unexpected error",
      error,
    }
  }
}

export const GetCurrentUserEmailAct = async () => {
  try {
    const token = window.localStorage.getItem("token")
    if (!token) throw new Error("No token found")

    const decoded = jwtDecode(token)
    const email = decoded?.email || null


    return email
  } catch (error) {
    console.error("Error getting user role:", error)
    return null
  }
}

export const UpdateCurrentUserAct = async (dataToUpdate) => {
  try {
    const token = window.localStorage.getItem("token")
    if (!token) throw new Error("No token found")

    const decoded = jwtDecode(token)
    const userId = decoded?.userId || null
    if (!userId) throw new Error("User ID not found in token")

    const response = await HttpClient.patch(`/user/${userId}`, dataToUpdate)
    return { success: true, data: response }
  } catch (error) {
    console.error("Error updating current user:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Unexpected error",
      error,
    }
  }
}

export const DeleteCurrentUserAct = async () => {
  try {
    const token = window.localStorage.getItem("token")
    if (!token) throw new Error("No token found")

    const decoded = jwtDecode(token)
    const userId = decoded?.userId || null
    if (!userId) throw new Error("User ID not found in token")

    const response = await HttpClient.delete(`/user/${userId}`)

    return { success: true, data: response }
  } catch (error) {
    console.error("Error deleting current user:", error)
    return {
      success: false,
      message: error?.response?.data?.message || "Unexpected error",
      error,
    }
  }
}