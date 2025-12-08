/**
 * Cart Reducer
 * 
 * Manages cart state with quantity tracking.
 * Cart structure: Array of objects with { product, quantity }
 * Each product in cart has a quantity field (default: 1)
 */

export const cartReducer = (state, action) => {
    const { type, payload } = action;

    switch(type){

        case "ADD_TO_CART":
            return {...state, cartList: payload.products, total: payload.total}
        
        case "REMOVE_FROM_CART":
            return {...state, cartList: payload.products, total: payload.total}
        
        case "UPDATE_QUANTITY":
            return {...state, cartList: payload.products, total: payload.total}
        
        case "CLEAR_CART":
            return {...state, cartList: payload.products, total: payload.total}

        default:
            throw new Error("No case found!");
    }
}