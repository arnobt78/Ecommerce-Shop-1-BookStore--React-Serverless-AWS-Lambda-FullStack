import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context";
import { Rating } from "./Rating";
import { getProductImageUrl, getProductImageKey } from "../../utils/productImage";

export const ProductCard = ({product}) => {
    const { cartList, addToCart, removeFromCart } = useCart();
    const [inCart, setInCart] = useState(false);
    const {id, name, overview, price, rating, best_seller} = product;
    const productImageUrl = getProductImageUrl(product);

    useEffect(() => {
        const productInCart = cartList.find(item => item.id === product.id);

        if(productInCart){
            setInCart(true);
        } else {
            setInCart(false);
        }

    }, [cartList, product.id]);

  return (
    <div className="m-3 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
        <Link to={`/products/${id}`} className="relative" >
            { best_seller && <span className="absolute top-4 left-2 px-2 bg-orange-500 bg-opacity-90 text-white rounded">Best Seller</span> }
            {productImageUrl && (
              <img 
                key={getProductImageKey(product)}
                className="rounded-t-lg w-full h-64 object-cover" 
                src={productImageUrl} 
                alt={name}
                loading="lazy"
                onError={(e) => {
                  // Fallback: try poster if image_local fails, or hide if both fail
                  if (product.image_local && e.target.src !== product.poster && product.poster) {
                    e.target.src = product.poster;
                  } else {
                    e.target.style.display = "none";
                  }
                }}
              />
            )}
        </Link>
        <div className="p-5">
            <Link to={`/products/${id}`}>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{name}</h5>
            </Link>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{overview}</p>
            
            <div className="flex items-center my-2">
                <Rating rating={rating} />
            </div>

            {/* Stock Quantity Display */}
            {product.stock !== undefined && (
              <div className="mb-2">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  product.stock === 0 
                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    : product.stock <= (product.lowStockThreshold || 10)
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                }`}>
                  <i className={`bi ${product.stock === 0 ? "bi-x-circle" : product.stock <= (product.lowStockThreshold || 10) ? "bi-exclamation-triangle" : "bi-check-circle"} mr-1.5 text-xs`}></i>
                  {product.stock === 0 
                    ? "Out of Stock" 
                    : product.stock <= (product.lowStockThreshold || 10)
                    ? `Low Stock (${product.stock} left)`
                    : `${product.stock} in stock`
                  }
                </span>
              </div>
            )}

            <p className="flex justify-between items-center">
                <span className="text-2xl dark:text-gray-200">
                    <span>$</span><span>{price}</span>
                </span>
                { !inCart && (
                  <button 
                    onClick={() => {
                      // Prevent adding out-of-stock items
                      if (!product.in_stock) {
                        return;
                      }
                      addToCart(product);
                    }} 
                    className={`inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 ${!product.in_stock ? "opacity-50 cursor-not-allowed" : ""}`} 
                    disabled={!product.in_stock}
                  >
                    Add To Cart <i className="ml-1 bi bi-plus-lg"></i>
                  </button>
                )}  
                { inCart && (
                  <button 
                    onClick={() => removeFromCart(product)} 
                    className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800"
                  >
                    Remove Item <i className="ml-1 bi bi-trash3"></i>
                  </button>
                )} 
            </p>
        </div>
    </div>
  )
}
