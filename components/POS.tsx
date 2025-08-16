
import React, { useState, useMemo, useCallback } from 'react';
import { useAppData } from '../context/AppContext';
import NeumorphicCard from './NeumorphicCard';
import NeumorphicButton from './NeumorphicButton';
import { Product, SaleItem, Sale } from '../types';
import { PlusIcon, TrashIcon, CloseIcon } from './Icons';

// Invoice Modal Component defined within the same file for locality
const InvoiceModal: React.FC<{ sale: Sale; onClose: () => void }> = ({ sale, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative text-right" id="invoice-content">
                <button onClick={onClose} className="absolute top-4 left-4 text-gray-500 hover:text-gray-800">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">فاتورة ضريبية مبسطة</h2>
                <div className="mb-4">
                    <p><span className="font-semibold">رقم المعاملة:</span> #{sale.id.slice(-6)}</p>
                    <p><span className="font-semibold">التاريخ:</span> {new Date(sale.createdAt).toLocaleString('ar-AE')}</p>
                </div>
                <table className="w-full mb-6">
                    <thead>
                        <tr className="border-b-2 border-gray-300">
                            <th className="py-2 text-right">المنتج</th>
                            <th className="py-2 text-center">الكمية</th>
                            <th className="py-2 text-center">السعر</th>
                            <th className="py-2 text-left">الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sale.items.map(item => (
                            <tr key={item.productId} className="border-b border-gray-200">
                                <td className="py-2">{item.productName}</td>
                                <td className="py-2 text-center">{item.quantity}</td>
                                <td className="py-2 text-center">{item.price.toFixed(2)}</td>
                                <td className="py-2 text-left">{(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="text-left">
                    <p className="text-lg font-bold">الإجمالي: {sale.total.toFixed(2)} د.إ</p>
                </div>
                 <div className="mt-8 text-center">
                    <button 
                        onClick={() => window.print()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        طباعة الفاتورة
                    </button>
                </div>
                 <style>
                    {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #invoice-content, #invoice-content * {
                            visibility: visible;
                        }
                        #invoice-content {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                        }
                    }
                    `}
                </style>
            </div>
        </div>
    );
};

const POS: React.FC = () => {
    const { products, setProducts, sales, setSales } = useAppData();
    const [cart, setCart] = useState<SaleItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [lastSale, setLastSale] = useState<Sale | null>(null);

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products.filter(p => p.stock > 0);
        return products.filter(p =>
            (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode.includes(searchTerm)) && p.stock > 0
        );
    }, [products, searchTerm]);

    const addToCart = useCallback((product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.productId === product.id);
            if (existingItem) {
                if (existingItem.quantity < product.stock) {
                    return prevCart.map(item =>
                        item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                } else {
                    alert('لا يمكن إضافة المزيد، الكمية في المخزون غير كافية.');
                    return prevCart;
                }
            }
            return [...prevCart, { productId: product.id, productName: product.name, quantity: 1, price: product.price }];
        });
    }, []);
    
    const removeFromCart = useCallback((productId: string) => {
        setCart(prevCart => prevCart.filter(item => item.productId !== productId));
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        const product = products.find(p => p.id === productId);
        if (product && quantity > product.stock) {
            alert('الكمية المطلوبة تتجاوز المخزون المتاح.');
            return;
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item.productId === productId ? { ...item, quantity: Math.max(0, quantity) } : item
            ).filter(item => item.quantity > 0)
        );
    }, [products]);

    const total = useMemo(() => {
        return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }, [cart]);

    const completeSale = useCallback(() => {
        if (cart.length === 0) return;

        const newSale: Sale = {
            id: `sale-${Date.now()}`,
            items: cart,
            total: total,
            createdAt: new Date().toISOString(),
        };

        setSales([...sales, newSale]);

        // Update product stock
        const updatedProducts = products.map(p => {
            const cartItem = cart.find(item => item.productId === p.id);
            if (cartItem) {
                return { ...p, stock: p.stock - cartItem.quantity };
            }
            return p;
        });
        setProducts(updatedProducts);
        
        setLastSale(newSale);
        setCart([]);
    }, [cart, products, sales, setProducts, setSales, total]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
             {lastSale && <InvoiceModal sale={lastSale} onClose={() => setLastSale(null)} />}

            {/* Products List */}
            <div className="lg:col-span-2">
                <NeumorphicCard className="h-full flex flex-col">
                    <input
                        type="text"
                        placeholder="ابحث عن منتج بالاسم أو الباركود..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 mb-4 bg-slate-100 rounded-lg text-slate-700 border-2 border-transparent focus:border-blue-500 focus:outline-none shadow-[inset_5px_5px_10px_#bec3cf,inset_-5px_-5px_10px_#ffffff]"
                    />
                    <div className="overflow-y-auto flex-1 pr-2">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {filteredProducts.map(product => (
                                <div key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="p-3 bg-slate-100 rounded-lg cursor-pointer text-center transition-all duration-200 shadow-[5px_5px_10px_#bec3cf,-5px_-5px_10px_#ffffff] active:shadow-[inset_5px_5px_10px_#bec3cf,inset_-5px_-5px_10px_#ffffff]">
                                    <p className="font-semibold text-slate-800 truncate">{product.name}</p>
                                    <p className="text-sm text-slate-500">{product.price.toFixed(2)} د.إ</p>
                                    <p className="text-xs text-green-600">المخزون: {product.stock}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </NeumorphicCard>
            </div>

            {/* Cart */}
            <div className="lg:col-span-1">
                <NeumorphicCard className="h-full flex flex-col">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-200">سلة المشتريات</h2>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        {cart.length === 0 ? (
                             <p className="text-slate-500 text-center pt-10">السلة فارغة</p>
                        ) : (
                            cart.map(item => (
                                <div key={item.productId} className="flex items-center justify-between p-2 bg-slate-200/50 rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-800">{item.productName}</p>
                                        <p className="text-sm text-slate-600">{item.price.toFixed(2)} د.إ</p>
                                    </div>
                                    <div className="flex items-center mx-2">
                                        <input type="number" value={item.quantity} min="1"
                                               onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                                               className="w-16 text-center bg-slate-100 rounded-md shadow-[inset_2px_2px_4px_#bec3cf,inset_-2px_-2px_4px_#ffffff]"/>
                                    </div>
                                    <button onClick={() => removeFromCart(item.productId)} className="text-red-500 hover:text-red-700">
                                        <TrashIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="mt-auto pt-4 border-t-2 border-slate-200">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold text-slate-700">الإجمالي:</span>
                            <span className="text-2xl font-bold text-slate-800">{total.toFixed(2)} د.إ</span>
                        </div>
                        <NeumorphicButton
                            onClick={completeSale}
                            disabled={cart.length === 0}
                            className="w-full !py-3 !text-lg !font-bold !bg-green-500 !text-white !shadow-[5px_5px_10px_#1e854b,-5px_-5px_10px_#2aff93] active:!shadow-[inset_5px_5px_10px_#1e854b,inset_-5px_-5px_10px_#2aff93] disabled:!bg-slate-300 disabled:!text-slate-500 disabled:!shadow-none"
                        >
                            إتمام البيع
                        </NeumorphicButton>
                    </div>
                </NeumorphicCard>
            </div>
        </div>
    );
};

export default POS;
