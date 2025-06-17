import React, { useState, useEffect } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebase/firebase'; // ✅ Fixed import path
import swal from 'sweetalert';
import {getUsersRef} from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import {addDoc} from 'firebase/firestore';


const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', mobile: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [OTP, setOTP] = useState('');

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          console.log('reCAPTCHA solved ✅');
        },
        'expired-callback': () => {
          console.warn('reCAPTCHA expired');
        },
      });
    }
  }, []);

  const requestOtp = async () => {
    setLoading(true);

    if (!form.mobile.startsWith('+')) {
      swal({
        text: 'Mobile number must start with country code (e.g., +91XXXXXXXXXX)',
        icon: 'warning',
        buttons: false,
        timer: 3000,
      });
      setLoading(false);
      return;
    }

    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, form.mobile, appVerifier);
      window.confirmationResult = confirmation;

      swal({
        text: 'OTP Sent Successfully!',
        icon: 'success',
        buttons: false,
        timer: 3000,
      });
      setOtpSent(true);
    } catch (error) {
      console.error('OTP Request Failed:', error);
      swal({
        text: `OTP Request Failed: ${error.message}`,
        icon: 'error',
        buttons: false,
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      await window.confirmationResult.confirm(OTP);
      // ✅ User data Firestore me save karna
      uploadData();
      swal({
        text: 'Phone Verified Successfully!',
        icon: 'success',
        buttons: false,
        timer: 3000,
      });
      navigate('/login')
    } catch (error) {
      swal({
        text: 'Invalid OTP!',
        icon: 'error',
        buttons: false,
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

 const uploadData = async () => {
 const salt = bcrypt.genSaltSync(10);
 var hash = bcrypt.hashSync(form.password, salt);
  await addDoc(getUsersRef(),{
    name: form.name,
    password: hash,
    mobile: form.mobile
  });
 }

  return (
    <>
      <div id="recaptcha-container"></div>

      <div className="login-wrapper">
        <div className="login">
          <h1 className="heading">Sign up</h1>

          {otpSent ? (
            <>
              <div className="login-form">
                <label className="label">OTP</label>
                <input
                  type="text"
                  className="input"
                  value={OTP}
                  onChange={(e) => setOTP(e.target.value)}
                />
              </div>
              <button className="submit-button" onClick={verifyOtp}>
                {loading ? <TailSpin height={25} color="white" /> : 'Confirm OTP'}
              </button>
            </>
          ) : (
            <>
              <div className="login-form">
                <label className="label">Name</label>
                <input
                  type="text"
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="login-form">
                <label className="label">Mobile</label>
                <input
                  type="text"
                  className="input"
                  placeholder="+91XXXXXXXXXX"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                />
              </div>
              <div className="login-form">
                <label className="label">Password</label>
                <input
                  type={"password"}
                  className="input"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <button className="submit-button" onClick={requestOtp}>
                {loading ? <TailSpin height={25} color="white" /> : 'Request OTP'}
              </button>
            </>
          )}

          <div className="signup-text">
            Already have an account?{' '}
            <Link to="/login">
              <span className="span">Login</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
