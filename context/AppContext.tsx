
import React, { createContext, useContext, useState, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Product, Customer, Sale, Expense, User } from '../types';

interface AppContextType {
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    customers: Customer[];
    setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
    sales: Sale[];
    setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
    expenses: Expense[];
    setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
    isAuthenticated: boolean;
    user: User | null;
    login: (email: string, isManager: boolean) => void;
    logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const sampleProducts: Product[] = [
    { id: 'p1', name: 'تفاح', price: 5, stock: 100, barcode: '10001' },
    { id: 'p2', name: 'خبز', price: 2, stock: 200, barcode: '10002' },
    { id: 'p3', name: 'حليب', price: 8, stock: 50, barcode: '10003' },
    { id: 'p4', name: 'بيض (علبة)', price: 15, stock: 80, barcode: '10004' },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useLocalStorage<Product[]>('hisabati_products', sampleProducts);
    const [customers, setCustomers] = useLocalStorage<Customer[]>('hisabati_customers', []);
    const [sales, setSales] = useLocalStorage<Sale[]>('hisabati_sales', []);
    const [expenses, setExpenses] = useLocalStorage<Expense[]>('hisabati_expenses', []);
    const [user, setUser] = useLocalStorage<User | null>('hisabati_user', null);

    const login = (email: string, isManager: boolean) => {
        const newUser: User = { id: Date.now().toString(), email, isManager };
        setUser(newUser);
    };

    const logout = () => {
        setUser(null);
    };

    const value = {
        products,
        setProducts,
        customers,
        setCustomers,
        sales,
        setSales,
        expenses,
        setExpenses,
        isAuthenticated: !!user,
        user,
        login,
        logout,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppData = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppData must be used within an AppProvider');
    }
    return context;
};

export const useAuth = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AppProvider');
    }
    return {
        isAuthenticated: context.isAuthenticated,
        user: context.user,
        login: context.login,
        logout: context.logout,
    };
};
