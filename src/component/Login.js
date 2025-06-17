import React, { useContext, useState } from 'react'
import { TailSpin } from 'react-loader-spinner';
import { Link, useNavigate } from 'react-router-dom';
import {query, where, getDocs, doc} from 'firebase/firestore'
import { getUsersRef } from '../firebase/firebase';
import { Appstate } from '../App';
import bcrypt from 'bcryptjs'
import swal from 'sweetalert';


const Login = () => {
const navigate = useNavigate();
const useAppState = useContext(Appstate);
const [form, setForm] = useState({
mobile: "",
password: ""
});

const [loading, setLoading] = useState(false);

const login = async () => {
  setLoading(true);
  try{
    const quer = query(getUsersRef(), where('mobile', '==', form.mobile))
    const querySnapshot = await getDocs(quer);

    querySnapshot.forEach((doc) => {
    const _data = doc.data();
    const isUser = bcrypt.compareSync(form.password, _data.password);
    if(isUser){
      useAppState.setLogin(true);
      useAppState.setUserName(_data.name);
      console.log("User name after login:", useAppState.userName);

      localStorage.setItem("userName", _data.name);
      navigate('/')
       swal({
      title: "Logged In",
      icon: "success",
      buttons: false,
      timer: "3000"
    });
    } else{
      swal({
      title: "Invalid Password",
      icon: "error",
      buttons: false,
      timer: "3000"
       });
    }
    })

   
  } catch (error) {
  console.error("Login Error:", error);
  swal({
    title: "Something went wrong!",
    icon: "error",
    buttons: false,
    timer: 3000,
  });
}
  setLoading(false);
}
  return (
    <div className='login-wrapper'>
      <div className='login'>
     <h1 className='heading'>Login</h1>

     <div className='login-form'>
      <label htmlFor='mobile' className='label'>Mobil No.</label>
      <input
      type='text'
      id='mobile'
      name='mobile'
      value={form.mobile}
      onChange={(e) => setForm({...form, mobile: e.target.value})}
      className='input'
            />
     </div>

<div className='login-form'>
  <label htmlFor='password' className='label'>password</label>
  <input
  type='password'
  id='password'
  name='password'
  value={form.password}
  onChange={(e) => setForm({...form, password: e.target.value})}
  className='input'
  />
</div>

<div>
  <button onClick={login} type='submit' className='submit-button'>
  {loading ? <TailSpin height={25} color='white'/> : 'Login'}   
  </button>
</div>

<div className='signup-text'> 
  Do not have account? <Link to={'/signup'}><span className='span'>Sign Up</span></Link> 
</div>
 </div>
  </div>
  );
};

export default Login;
