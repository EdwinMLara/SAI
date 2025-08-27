import React, { createContext, ReactNode } from 'react';

export const AuthContext = createContext({});

interface AuthProviderProps {
   children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
   return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};
