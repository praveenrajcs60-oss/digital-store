import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('devvault_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem('devvault_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // Digital downloads typically quantity 1, but we support incrementing or just notify
        return prev;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsDrawerOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    setDiscountCode('');
    setDiscountPercent(0);
    localStorage.removeItem('devvault_cart');
  };

  const applyDiscount = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'WELCOME20') {
      setDiscountCode('WELCOME20');
      setDiscountPercent(20);
      return { success: true, message: '20% discount applied!' };
    }
    if (cleanCode === 'SAVE10') {
      setDiscountCode('SAVE10');
      setDiscountPercent(10);
      return { success: true, message: '10% discount applied!' };
    }
    return { success: false, message: 'Invalid promo code. Try WELCOME20 or SAVE10' };
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = Math.max(0, subtotal - discountAmount);
  const itemCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isDrawerOpen,
        setIsDrawerOpen,
        addToCart,
        removeFromCart,
        clearCart,
        discountCode,
        discountPercent,
        discountAmount,
        applyDiscount,
        subtotal,
        total,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
