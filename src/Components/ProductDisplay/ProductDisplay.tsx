import { useContext } from 'react';
import './ProducDisplay.css'
import { ShopContext } from '../../Context/ShopContext';
interface Product {
    id: number;
    name: string;
    category: string;
    image: string;
    new_price: number;
    old_price: number;
}

interface BreadcrumProps {
    product: Product;
}

const ProductDisplay = (props:BreadcrumProps) => {
    const {product}=props
    const{ addToCart }=useContext(ShopContext)
  return (
    <div className='productdisplay'>
        <div className="productdisplay-left">
            <div className="productdisplay-img-list">
                <img src={product.image} alt="" />
                <img src={product.image} alt="" />
                <img src={product.image} alt="" />
                <img src={product.image} alt="" />
            </div>
            <div className="productdisplay-img">
            <img className="productdisplay-main-img" src={product.image} alt="" />
            </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
            
            <div className="productdisplay-prices">
                <div className="productdisplay-price-old">${product.old_price}</div>
                <div className="productdisplay-price-new">${product.new_price}</div>
            </div>
            <div className="productdisplay-desc">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis temporibus id a eos,  unde saepe fugiat non quis, numquam adipisci.
                Iure quidem eligendi architecto laudantium accusamus enim voluptas excepturi voluptate? 
            </div>
            <div className="productdisplay-size">
                <h1>Select Size</h1>
                <div className="productdisplay-sizes">
                    <div>6</div>
                    <div>8</div>
                    <div>10</div>
                    <div>12</div>
                    <div>14</div>
                </div>
            </div>
            <button onClick={()=>{addToCart(product.id)}}>ADD TO CART</button>
            </div>
        </div>
        
       
    
  )
}

export default ProductDisplay