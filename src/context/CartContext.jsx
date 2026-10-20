"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "maxsel_enquiry_cart";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount (prevents SSR hydration mismatch)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems, isLoaded]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) return;
    const addQty = Math.max(1, Number(quantity) || 1);

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => String(item.id) === String(product.id));

      if (existingIndex > -1) {
        // Increment quantity of existing item
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + addQty,
        };
        return updated;
      }

      // Add new item
      const newItem = {
        id: product.id,
        name: product.name || "Product",
        model_no: product.model_no || "",
        category_name: product.category_name || "Commercial Equipment",
        image_url: product.image_url || "/products/velvet_covered_clean.png",
        price: product.price || 0,
        brand: product.brand || "Maxsel",
        quantity: addQty,
      };
      return [...prev, newItem];
    });
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    const qty = Number(newQuantity);
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        String(item.id) === String(productId) ? { ...item, quantity: qty } : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => String(item.id) !== String(productId)));
  };

  // Clear all items in cart
  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear cart storage", e);
    }
  };

  // Total count of all items (sum of quantities)
  const totalCount = cartItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoaded,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
