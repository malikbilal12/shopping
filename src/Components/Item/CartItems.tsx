import { useContext } from 'react'
import './CartItem.css'
import { ShopContext } from '../../Context/ShopContext'
import remove_icon from '../Assets/cart_cross_icon.png'

interface Product {
    id: number;
    name: string;
    category: string;
    image: string;
    new_price: number;
    old_price: number;
}

const CartItems = () => {
    const { all_products, cartItem, removeFromCart,getTotalCartAmount } = useContext(ShopContext) 
    return (
        <div className='cartitems'>
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            {all_products.map((e: Product) => {
                if (cartItem[e.id]) {
                    return (
                        <div key={e.id}>
                            <div className="cartitems-format cartitems-format-main">
                                <img src={e.image} className='carticon' alt="" />
                                <p>{e.name}</p>
                                <p>${e.new_price}</p>
                                <button className='cart-quantity'>{cartItem[e.id]}</button>
                                <p>${e.new_price * cartItem[e.id]}</p>
                                <img className='remove_icon' src={remove_icon} onClick={() => { removeFromCart(e.id) }} alt="" />
                            </div>
                            <hr />
                        </div>
                    );
                }
                return null;
            })}
            <div className="cart-down">
                <div className="cart-total">
                    <h1>Cart Totals</h1>
                    <div className="total-item">
                        <p>Sub Total</p>
                        <p>${getTotalCartAmount() }</p>
                    </div>
                    <hr />
                    <div className="total-item">
                        <p>Shipping Fee</p>
                        <p>Free</p>
                    </div>
                    <hr />
                    <div className="total-item">
                        <h3>Total</h3>
                        <h3>${getTotalCartAmount()}</h3>
                    </div>
                    <button>CHECKOUT</button>
                </div>
            </div>
        </div>
    );
}

export default CartItems;
