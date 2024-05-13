import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { MouseEvent, useContext, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
import nav_dromdown from '../Assets/down-arrow.png'

const Navbar = () => {

    const [menu,setMenu]=useState('shop')
    const { getTotalCartItem } = useContext(ShopContext) 
    const menuRef = useRef<HTMLUListElement>(null)

    const dropdownToggle = (e: MouseEvent<HTMLImageElement>) => {
        menuRef.current?.classList.toggle('nav-menu-visible');
        e.currentTarget.classList.toggle('open'); 
    };
        
    
  
  return (
    <div className='navbar'>
        <div className='nav-logo'>
            <img src={logo} />
            <p>SHOPPER</p>
        </div>
        <img className='nav-dropwon' onClick={dropdownToggle} src={nav_dromdown} alt="" />
        <ul ref={menuRef} className='nav-menu'>
            <li onClick={()=>{setMenu('shop')}}><Link style={{textDecoration:'none'}} to='/'>Shop</Link>{menu==='shop'?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu('mens')}}><Link style={{textDecoration:'none'}} to='/mens'>Men</Link>{menu==='mens'?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu('womens')}}><Link style={{textDecoration:'none'}} to='/womens'>Women</Link>{menu==='womens'?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu('kids')}}><Link style={{textDecoration:'none'}} to='/kids'>Kids</Link>{menu==='kids'?<hr/>:<></>}</li>
        </ul>
        <div className='nav-login-cart'>
            {localStorage.getItem('auth-token')?
            <button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>
            :<Link  to='login'><button onClick={()=>{setMenu('')}}>Login</button></Link>}
        
            <Link to='cart'><img onClick={()=>{setMenu('')}} src={cart_icon} /></Link>
            <div className="nav-cart-count">{getTotalCartItem()}</div>
        </div>
    </div>
  )
}

export default Navbar