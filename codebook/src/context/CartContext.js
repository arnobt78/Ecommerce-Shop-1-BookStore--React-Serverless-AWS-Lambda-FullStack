import { createContext, useContext, useReducer, useEffect, useRef } from "react";
import { cartReducer } from "../reducers";

const cartInitialState = {
    cartList: [],
    total: 0
}

const CartContext = createContext(cartInitialState);

export const CartProvider = ({children}) => {
    const [state, dispatch] = useReducer(cartReducer, cartInitialState);
    const previousUserIdRef = useRef(null); // Track previous user ID to detect user changes

    /**
     * Add product to cart or increase quantity if already exists
     * Cart items structure: { ...product, quantity: number }
     */
    function addToCart(product){
        // Validate product
        if (!product || !product.id) {
            console.warn('Cannot add invalid product to cart');
            return;
        }

        // Prevent adding out-of-stock items
        // Check both in_stock boolean and stock quantity (if available)
        const isOutOfStock = product.stock !== undefined 
            ? product.stock === 0 
            : !product.in_stock;
        
        if (isOutOfStock) {
            console.warn('Cannot add out-of-stock product to cart:', product.name);
            return;
        }

        // Check if requested quantity exceeds available stock (if stock tracking enabled)
        if (product.stock !== undefined) {
            const existingItem = state.cartList.find(item => item.id === product.id);
            const currentQuantity = existingItem ? existingItem.quantity : 0;
            const requestedQuantity = currentQuantity + 1; // Adding 1 more item
            
            if (requestedQuantity > product.stock) {
                console.warn(`Cannot add more items. Available stock: ${product.stock}, Requested: ${requestedQuantity}`, product.name);
                return;
            }
        }

        // Check if product already exists in cart
        const existingItemIndex = state.cartList.findIndex(item => item.id === product.id);
        const productPrice = product.price || 0;
        
        let updatedList;
        let updatedTotal;

        if (existingItemIndex >= 0) {
            // Product exists - increase quantity
            updatedList = state.cartList.map((item, index) => {
                if (index === existingItemIndex) {
                    return { ...item, quantity: (item.quantity || 1) + 1 };
                }
                return item;
            });
            updatedTotal = state.total + productPrice;
        } else {
            // New product - add with quantity 1
            updatedList = [...state.cartList, { ...product, quantity: 1 }];
            updatedTotal = state.total + productPrice;
        }

        dispatch({
            type: "ADD_TO_CART",
            payload: {
                products: updatedList,
                total: updatedTotal
            }
        })
    }

    /**
     * Remove product from cart completely
     */
    function removeFromCart(product){
        if (!product || !product.id) return;
        
        const itemToRemove = state.cartList.find(item => item.id === product.id);
        if (!itemToRemove) return;

        const itemTotal = (itemToRemove.quantity || 1) * (itemToRemove.price || 0);
        const updatedList = state.cartList.filter(item => item.id !== product.id);
        const updatedTotal = Math.max(0, state.total - itemTotal); // Ensure total doesn't go negative

        dispatch({
            type: "REMOVE_FROM_CART",
            payload: {
                products: updatedList,
                total: updatedTotal
            }
        })
    }

    /**
     * Update quantity of a product in cart
     * @param {Object} product - Product object
     * @param {number} newQuantity - New quantity (must be >= 1)
     */
    function updateQuantity(product, newQuantity) {
        if (!product || !product.id) return;
        
        // Ensure quantity is at least 1
        const quantity = Math.max(1, Math.floor(newQuantity || 1));
        
        const existingItemIndex = state.cartList.findIndex(item => item.id === product.id);
        if (existingItemIndex < 0) return;

        const existingItem = state.cartList[existingItemIndex];
        const oldQuantity = existingItem.quantity || 1;
        const quantityDiff = quantity - oldQuantity;
        
        // If quantity hasn't changed, no need to update
        if (quantityDiff === 0) return;

        // Check stock availability if increasing quantity and stock tracking is enabled
        if (quantityDiff > 0 && product.stock !== undefined) {
            if (quantity > product.stock) {
                console.warn(`Cannot increase quantity. Available stock: ${product.stock}, Requested: ${quantity}`, product.name);
                return; // Don't update if exceeds available stock
            }
        }
        
        const updatedList = state.cartList.map((item, index) => {
            if (index === existingItemIndex) {
                return { ...item, quantity };
            }
            return item;
        });

        const pricePerUnit = existingItem.price || 0;
        const updatedTotal = Math.max(0, state.total + (quantityDiff * pricePerUnit)); // Ensure total doesn't go negative

        dispatch({
            type: "UPDATE_QUANTITY",
            payload: {
                products: updatedList,
                total: updatedTotal
            }
        })
    }

    function clearCart(){
        dispatch({
            type: "CLEAR_CART",
            payload: {
                products: [],
                total: 0
            }
        })
    }

    /**
     * Clear cart when user changes (login/logout)
     * Monitors sessionStorage for user ID changes to prevent cart persisting across users
     */
    useEffect(() => {
        const checkUserChange = () => {
            try {
                const currentUserId = sessionStorage.getItem("cbid");
                const parsedUserId = currentUserId ? JSON.parse(currentUserId) : null;

                // If user ID changed (login, logout, or switch user), clear cart
                if (previousUserIdRef.current !== null && previousUserIdRef.current !== parsedUserId) {
                    clearCart();
                }

                // Update previous user ID
                previousUserIdRef.current = parsedUserId;
            } catch (error) {
                // If error parsing, treat as logout (no user)
                if (previousUserIdRef.current !== null) {
                    clearCart();
                    previousUserIdRef.current = null;
                }
            }
        };

        // Check on mount
        checkUserChange();

        // Listen for storage changes (logout/login events)
        const handleStorageChange = () => {
            checkUserChange();
        };

        // Listen for custom sessionStorage change event (from authService)
        window.addEventListener("sessionStorageChange", handleStorageChange);
        
        // Listen for storage events (cross-tab updates)
        window.addEventListener("storage", handleStorageChange);

        // Also check periodically to catch any missed updates
        const interval = setInterval(checkUserChange, 500);

        return () => {
            window.removeEventListener("sessionStorageChange", handleStorageChange);
            window.removeEventListener("storage", handleStorageChange);
            clearInterval(interval);
        };
    }, []); // Empty dependency array - only run on mount/unmount

    const value = {
        cartList: state.cartList,
        total: state.total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext);
    return context;
}