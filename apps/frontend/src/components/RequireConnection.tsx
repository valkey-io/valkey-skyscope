import { Navigate, Outlet } from "react-router"
import useIsConnected from "@/hooks/useIsConnected.ts"

const RequireConnection = () => {
  const isConnected = useIsConnected()

  return isConnected ? <Outlet/> : <Navigate to="/connect" replace/>
}

export default RequireConnection