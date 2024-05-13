import React, { createContext, ReactNode, useEffect, useState } from "react";
import all_products from '../Components/Assets/all_product';

interface ShopContextType {
    all_products: {
        id: number;
        name: string;
        category: string;
        image: string;
        new_price: number;
        old_price: number;
    }[];
    cartItem: Record<number, number>; 
    addToCart: (itemId: number) => void;
    removeFromCart: (itemId: number) => void;
    getTotalCartAmount: () => number;
    getTotalCartItem:()=>number;
}

const getDefaultCart = () => {
    const cart: Record<number, number> = {}
    for(let i=0;i<300+1;i++){
        cart[i]=0
    }
    return cart;
};


export const ShopContext = createContext<ShopContextType>(null);

const ShopContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // const [all_products,setAllProducts]=useState([])
    const [cartItem, setCartItem] = useState(getDefaultCart());
    useEffect(()=>{
        // fetch('http://localhost:4000/allproducts')
        // .then((res)=>res.json())
        // .then((data)=>setAllProducts(data))

        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/getcart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:''
            }).then((resp)=>resp.json()).then((data)=>{setCartItem(data);
            })
        }
    },[])
    
 const addToCart = (itemId: number) => { 
        console.log("Auth-token:", localStorage.getItem('auth-token'));
        setCartItem((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));              
        if(localStorage.getItem('auth-token')){            
            fetch('http://localhost:4000/addtocart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId})
            }).then((resp)=>resp.json()).then((data)=>{console.log(data);
            })
        }     
    };
    
    
    

    const removeFromCart = (itemId: number) => { 
        setCartItem((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if(localStorage.getItem('auth-token')){            
            fetch('http://localhost:4000/removecart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId})
            }).then((resp)=>resp.json()).then((data)=>{console.log(data);
            })
        } 
    };
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItem) {
            if (cartItem[item] > 0) {
                const itemInfo = all_products.find((p) => p.id === Number(item));
                if (itemInfo) { 
                    totalAmount += itemInfo.new_price * cartItem[item];
                }
            }
        }
        return totalAmount;
    };
    const getTotalCartItem=()=>{
        let totalItem=0
        for(const item in cartItem){
            if(cartItem[item]>0){totalItem+=cartItem[item]}
        }return totalItem
    }
    
    const contextValue = { all_products, cartItem, addToCart, removeFromCart,getTotalCartAmount ,getTotalCartItem};
    return (
        <ShopContext.Provider value={contextValue}>
            {children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
[]