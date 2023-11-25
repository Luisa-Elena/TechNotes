import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

// we will use this component as a wrapper more than once inside app.js
const RequireAuth = ({ allowedRoles }) => { //an array being passed in
    const location = useLocation()
    const { roles } = useAuth()

    const content = (
        roles.some(role => allowedRoles.includes(role))
            ? <Outlet /> //wrapper to protect whatever ve have inside of it
            : <Navigate to="/login" state={{ from: location }} replace />
    )

    return content
}
export default RequireAuth