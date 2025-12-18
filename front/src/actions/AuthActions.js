import HttpClient from "../Services/HttpClient"
import toast from "react-hot-toast"


export const registerUserAct = async (user) => {
  try {
    const response = await HttpClient.post("/auth/register", user)
    toast.success("Usuario registrado correctamente. Revisa tu correo.")
    return { success: true, data: response }
  } catch (error) {
    const message = error.response?.data?.message || "Error en el registro"
    toast.error(message)
    return {
      success: false,
      message,
      error
    }
  }
}


export const UserLoginAct = async (user) => {
  try {
    const response = await HttpClient.post("/auth/login", user)
    const { token } = response

    window.localStorage.setItem("token", token)
    toast.success("Inicio de sesión exitoso")

    return { success: true, data: response }
  } catch (error) {
    const message = error.response?.data?.message || "Credenciales inválidas"
    toast.error(message)
    return {
      success: false,
      message,
      error
    }
  }
}


export const verifyEmailAct = async (token) => {
  try {
    const response = await HttpClient.get(`/auth/verify-email?token=${token}`)
    toast.success("Correo verificado exitosamente")
    return { success: true, data: response }
  } catch (error) {
    const message = error.response?.data?.message || "Error al verificar el correo"
    toast.error(message)
    return {
      success: false,
      message,
      error
    }
  }
}
