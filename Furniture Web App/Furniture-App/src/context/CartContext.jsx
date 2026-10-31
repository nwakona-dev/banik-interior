
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add each product only once.
  const addToCart = (product) => {
    setCartItems((currentItems) => {
      const alreadyExists = currentItems.some(
        (item) => item.name === product.name
      );

      if (alreadyExists) {
        return currentItems;
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // Update the quantity of an existing product.
  const updateQuantity = (productName, newQuantity) => {
    const quantity = Math.max(
      1,
      Math.floor(Number(newQuantity) || 1)
    );

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.name === productName
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Remove the entire product, regardless of quantity.
  const removeFromCart = (productName) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => item.name !== productName
      )
    );
  };

  // Count individual units rather than distinct products.
  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const contextValue = useMemo(
    () => ({
      cartItems,
      cartCount,
      addToCart,
      updateQuantity,
      removeFromCart,
    }),
    [cartItems, cartCount]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used within a CartProvider"
    );
  }

  return context;
};

export default CartContext;
