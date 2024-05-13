import { Link } from 'react-router-dom';
import './Item.css';

interface ItemProps {
  id: number;
  name: string;
  image: string;
  new_price: number;
  old_price: number;
}

const Item: React.FC<ItemProps> = (props) => {
  const { image, name, new_price, old_price ,id} = props;
  return (
    <div className='item'>
     <Link to={`/product/${id}`}><img src={image} alt='' /></Link> 
      <p>{name}</p>
      <div className="item-prices">
        <div className="item-price-new">
         ${new_price}
        </div>
        <div className="item-price-old">
          ${old_price} 
        </div> 
      </div>
    </div>
  );
};

export default Item;
