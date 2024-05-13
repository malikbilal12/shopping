import './Breadcrum.css'
import arrow_icon from '../Assets/breadcrum_arrow.png'

interface Product {
    category: string;
    name: string;
}

interface BreadcrumProps {
    product: Product;
}
const Breadcrum = (props:BreadcrumProps) => {
    const {product}=props
  return (
    <div className='breadcrums'>
        Home <img src={arrow_icon} alt="" />
        Shop <img src={arrow_icon} alt="" />
        {product.category} <img src={arrow_icon} alt="" />
        {product.name}
    </div>
  )
}

export default Breadcrum