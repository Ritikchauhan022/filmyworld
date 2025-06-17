// console.log("Current user name from context:", useAppState.userName);
import React,{useContext} from 'react'
import { Link } from 'react-router-dom'
import { Appstate } from '../App'
import { Button } from '@mui/material'

const Header = () => {
const useAppState = useContext(Appstate);

console.log("Current user name from context:", useAppState.userName);
const logout = () => {
    useAppState.setLogin(false);
    useAppState.setUserName("");
    localStorage.removeItem("userName");
  };
  return (
    <>
<div className="ram">
 <Link to='/' className='no-underline '><span className='rama'>Filmy<span className="rama">World</span></span> </Link>
  { useAppState.login ?
  <Link to={'/addmovie'} style={{textDecoration: "none"}} ><p className="rv">
  <span className="plus"> + </span><span className='me'>Add New</span>
  </p></Link>
  :
  <Link to={'/login'} style={{textDecoration: "none"}} ><p className="rv">
 <span className='me'>Login</span>
  </p></Link>
}
</div>
</>
)
}

export default Header