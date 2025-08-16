
import React, { useState } from 'react';
import { useAppData } from '../context/AppContext';
import { Product } from '../types';
import NeumorphicCard from './NeumorphicCard';
import NeumorphicButton from './NeumorphicButton';
import { PlusIcon, EditIcon, TrashIcon, CloseIcon, BarcodeIcon } from './Icons';

// Product Form Modal
const ProductFormModal: React.FC<{
    product: Product | null;
    onClose: () => void;
    onSave: (product: Product) => void;
}> = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState<Omit<Product, 'id'>>({
        name: product?.name || '',
        price: product?.price || 0,
        stock: product?.stock || 0,
        barcode: product?.barcode || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newProduct: Product = {
            id: product?.id || `prod-${Date.now()}`,
            ...formData
        };
        onSave(newProduct);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <NeumorphicCard className="w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-4 left-4 text-slate-500 hover:text-slate-800">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">{product ? 'تعديل منتج' : 'إضافة منتج جديد'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">اسم المنتج</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 bg-slate-100 rounded-lg shadow-[inset_3px_3px_6px_#bec3cf,inset_-3px_-3px_6px_#ffffff]"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-slate-600 mb-1">السعر</label>
                           <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="w-full p-3 bg-slate-100 rounded-lg shadow-[inset_3px_3px_6px_#bec3cf,inset_-3px_-3px_6px_#ffffff]"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">الكمية بالمخزون</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" className="w-full p-3 bg-slate-100 rounded-lg shadow-[inset_3px_3px_6px_#bec3cf,inset_-3px_-3px_6px_#ffffff]"/>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">الباركود</label>
                        <input type="text" name="barcode" value={formData.barcode} onChange={handleChange} className="w-full p-3 bg-slate-100 rounded-lg shadow-[inset_3px_3px_6px_#bec3cf,inset_-3px_-3px_6px_#ffffff]"/>
                    </div>
                    <div className="pt-4 flex justify-end">
                        <NeumorphicButton onClick={()=>{}} className="!bg-blue-500 !text-white !shadow-[5px_5px_10px_#428eff,-5px_-5px_10px_#64a9ff]">
                            {product ? 'حفظ التعديلات' : 'إضافة المنتج'}
                        </NeumorphicButton>
                    </div>
                </form>
            </NeumorphicCard>
        </div>
    );
};


const Products: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
    const { products, setProducts } = useAppData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleSaveProduct = (product: Product) => {
        if (editingProduct) {
            setProducts(products.map(p => p.id === product.id ? product : p));
        } else {
            setProducts([...products, product]);
        }
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleDeleteProduct = (productId: string) => {
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المنتج؟')) {
            setProducts(products.filter(p => p.id !== productId));
        }
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {isModalOpen && <ProductFormModal product={editingProduct} onClose={() => setIsModalOpen(false)} onSave={handleSaveProduct} />}
            
            {isAdmin && (
                <div className="flex justify-end">
                    <NeumorphicButton onClick={openAddModal} className="flex items-center space-x-2 space-x-reverse !bg-green-500 !text-white !shadow-[5px_5px_10px_#4caf50,-5px_-5px_10px_#81c784]">
                        <PlusIcon className="w-5 h-5" />
                        <span>إضافة منتج جديد</span>
                    </NeumorphicButton>
                </div>
            )}
            
            <NeumorphicCard>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="border-b-2 border-slate-200">
                            <tr>
                                <th className="p-4 text-slate-600 font-semibold">المنتج</th>
                                <th className="p-4 text-slate-600 font-semibold">السعر</th>
                                <th className="p-4 text-slate-600 font-semibold">المخزون</th>
                                <th className="p-4 text-slate-600 font-semibold">الباركود</th>
                                {isAdmin && <th className="p-4 text-slate-600 font-semibold">إجراءات</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} className="border-b border-slate-200/70">
                                    <td className="p-4 font-medium text-slate-800">{product.name}</td>
                                    <td className="p-4 text-slate-700">{product.price.toFixed(2)} د.إ</td>
                                    <td className="p-4 text-slate-700">{product.stock}</td>
                                    <td className="p-4 text-slate-700 flex items-center">
                                        <BarcodeIcon className="w-5 h-5 ml-2 text-slate-400" />
                                        {product.barcode}
                                    </td>
                                    {isAdmin && (
                                        <td className="p-4">
                                            <div className="flex space-x-2 space-x-reverse">
                                                <button onClick={() => openEditModal(product)} className="p-2 rounded-full text-blue-600 bg-slate-100 shadow-[3px_3px_6px_#bec3cf,-3px_-3px_6px_#ffffff] active:shadow-[inset_2px_2px_4px_#bec3cf,inset_-2px_-2px_4px_#ffffff]">
                                                    <EditIcon className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleDeleteProduct(product.id)} className="p-2 rounded-full text-red-600 bg-slate-100 shadow-[3px_3px_6px_#bec3cf,-3px_-3px_6px_#ffffff] active:shadow-[inset_2px_2px_4px_#bec3cf,inset_-2px_-2px_4px_#ffffff]">
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </NeumorphicCard>
        </div>
    );
};

export default Products;
