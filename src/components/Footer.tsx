import { useLocation } from "react-router-dom"

const Footer = () => {
  const location = useLocation()
  const isLoginPage = location.pathname === "/login"

  return (
    <footer className="relative bottom-0 left-0 text-center w-full p-5">
      <p className={`text-sm ${isLoginPage ? "text-teal-100" : "text-gray-400"}`}>
        © {new Date().getFullYear()} Ikusi. Todos los derechos reservados.
      </p>
    </footer>
  )
}
export default Footer
