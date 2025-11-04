import React, { createContext, useState } from 'react';
import { useToastAlerts } from '../utils/toastAlerts.js';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { showSuccess, showInfo, showWarning } = useToastAlerts();

  const addToCart = (producto) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === producto.id);
      if (existing) {
        return prev.map((p) =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    
    showSuccess(`🛍️ ¡Agregado al carrito!`, `El ${producto.nombre || 'producto'} ha sido añadido.`);

  };

  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const productoEliminado = prev.find((p) => p.id === id);
      if (productoEliminado) {
        showInfo(`🗑️ ${productoEliminado.nombre || 'Producto'} eliminado del carrito.`);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, cantidad: Math.max(p.cantidad + delta, 1) }
          : p
      )
    );
  };

  const clearCart = () => {
    if (cartItems.length > 0) {
      showWarning('🧹 Carrito vaciado', 'Todos los productos fueron eliminados.');
    }
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
