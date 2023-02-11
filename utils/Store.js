import { createContext, useReducer } from 'react';
import Cookies from 'js-cookie';

export const Store = createContext();

// Cart array
const initialState = {
  // Cookies store data in string format
  cart: Cookies.get('cart')
    ? JSON.parse(Cookies.get('cart'))
    : { cartItems: [] },
};

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;

      // Looking for a existing item
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );

      // If item (existItem) is exist in the cart array,
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));

      // return { ...state, cart: { ...state.cart, cartItems } };
      return { cart: { ...state.cart, cartItems } };
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      );

      Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));

      return { cart: { ...state.cart, cartItems } };
      // return { ...state, cart: { ...state.cart, cartItems } };
    }
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
