
import {
  Navigate
} from 'react-router-dom'
function AuthenticatedGuard() {
  return(
      <>
        !isAuthenticated && !localStorage.getItem("token")? navigate('/login'):<Navigate to={"/"}  />
      </>
  )


}




export default AuthenticatedGuard
