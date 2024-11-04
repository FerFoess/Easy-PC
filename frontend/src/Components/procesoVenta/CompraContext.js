import React, { createContext, useContext, useState } from 'react';

const CompraContext = createContext();

export const CompraProvider = ({ children }) => {
  const [totalPrecio, setTotalPrecio] = useState(0);
  
  return (
    <CompraContext.Provider value={{ totalPrecio, setTotalPrecio }}>
      {children}
    </CompraContext.Provider>
  );
};

export const useCompra = () => {
  return useContext(CompraContext);
};
