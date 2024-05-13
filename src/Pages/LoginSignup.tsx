import { ChangeEvent, useState } from 'react'
import './css/LoginSignup.css'

const LoginSignup = () => {

  const [state, setState] = useState('login'); 
  const [formData,setData]=useState({
    username:'',
    password:'',
    email:''
  })
  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ ...formData, [e.target.name]: e.target.value });
};
  const login = async() => {
    console.log(formData);
    let responseData
    await fetch('http://localhost:4000/login',{
      method:'POST',
      headers:{Accept:'application/form-data','Content-Type':'application/json'},
      body:JSON.stringify(formData),
    }).then((res)=>res.json()).then((data)=>{responseData=data})
     console.log(responseData);
     if(responseData!.seccess){
      localStorage.setItem('auth-token',responseData!.token)
      window.location.replace('/')
      // setState('login')
     }else{
      alert(responseData!.errors)
     } 
  };

  const signup = async() => {
    console.log(formData);
    let responseData
    await fetch('http://localhost:4000/signup',{
      method:'POST',
      headers:{Accept:'application/form-data','Content-Type':'application/json'},
      body:JSON.stringify(formData),
    }).then((res)=>res.json()).then((data)=>{responseData=data})
     console.log(responseData);
     if(responseData!.seccess){
      localStorage.setItem('auth token',responseData!.token)
      // window.location.replace('/')
      setState('login')
     }else{
      alert(responseData!.errors)
     }   
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state }</h1>
        <div className="loginsignup-fields">
          {state==='Sign Up'?<input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Enter Your Name' />:''}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Enter Your Email' />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Enter Password' />
        </div>
        <button onClick={() => { state === 'login' ? login() : signup() }}>Continue</button>
        {state==='Sign Up'?<div className="loginsignup-login">Already have an account? <span onClick={()=>{setState('login')}}>Login</span></div>
        :<div className="loginsignup-login">Create have an account? <span onClick={()=>{setState('Sign Up')}}>SignUp</span></div>}   
        
      <div className="loginsignup-agree">
        <input type="checkbox" name='' id='' />
        <p>By continuing, i agree to the term of user & privacy policy.</p>
      </div>
      </div>
    </div>
  )
}

export default LoginSignup