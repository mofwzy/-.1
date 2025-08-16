
import React, { useState } from 'react';
import { useAppData } from '../context/AppContext';
import { Customer } from '../types';
import NeumorphicCard from './NeumorphicCard';
import NeumorphicButton from './NeumorphicButton';
import { PlusIcon, EditIcon, TrashIcon, CloseIcon } from './Icons';

const CustomerFormModal: React.FC<{
    customer: Customer | null;
    onClose: () => void;
    onSave: (customer: Customer) => void;
}> = ({ customer, onClose, onSave }) => {
    const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
        name: customer?.name || '',
        phone: customer?.phone || '',
        email: customer?.email || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newCustomer: Customer = {
            id: customer?.id || `cust-${Date.now()}`,
            ...formData
        };
        onSave(newCustomer);
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <NeumorphicCard className="w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-4 left-4 text-slate-500 hover:text-slate-800">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">{customer ? 'تعديل عميل' : 'إضافة عميل جديد'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">اسم العميل</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 bg-slate-100 rounded-lg shadow-[inset_3px_3px_6px_#bec3cf,inset_-3px_-3px_6px_#ffffff]"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-slate-600 mb-1">رقم الهاتف</label>
                           <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-3 bg-slate-100 rounded-lg shadow-[inset_3px_3px_6px_#bec3cf,inset_-3px_-3px_6px_#ffffff]"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">البريد الإلكتروني (اختياري)</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 bg-slate-100 rounded-lg shadow-[inset_3px_3px_6px_#bec3cf,inset_-3px_-3px_6px_#ffffff]"/>
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end">
                        <NeumorphicButton onClick={()=>{}} className="!bg-blue-500 !text-white !shadow-[5px_5px_10px_#428eff,-5px_-5px_10px_#64a9ff]">
                            {customer ? 'حفظ التعديلات' : 'إضافة العميل'}
                        </NeumorphicButton>
                    </div>
                </form>
            </NeumorphicCard>
        </div>
    );
};

const Customers: React.FC = () => {
    const { customers, setCustomers } = useAppData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    const handleSaveCustomer = (customer: Customer) => {
        if (editingCustomer) {
            setCustomers(customers.map(c => c.id === customer.id ? customer : c));
        } else {
            setCustomers([...customers, customer]);
        }
        setIsModalOpen(false);
        setEditingCustomer(null);
    };

    const handleDeleteCustomer = (customerId: string) => {
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا العميل؟')) {
            setCustomers(customers.filter(c => c.id !== customerId));
        }
    };

    const openAddModal = () => {
        setEditingCustomer(null);
        setIsModalOpen(true);
    };

    const openEditModal = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };
    
    return (
        <div className="space-y-6">
            {isModalOpen && <CustomerFormModal customer={editingCustomer} onClose={() => setIsModalOpen(false)} onSave={handleSaveCustomer} />}
            
            <div className="flex justify-end">
                <NeumorphicButton onClick={openAddModal} className="flex items-center space-x-2 space-x-reverse !bg-green-500 !text-white !shadow-[5px_5px_10px_#4caf50,-5px_-5px_10px_#81c784]">
                    <PlusIcon className="w-5 h-5" />
                    <span>إضافة عميل جديد</span>
                </NeumorphicButton>
            </div>
            
            <NeumorphicCard>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="border-b-2 border-slate-200">
                            <tr>
                                <th className="p-4 text-slate-600 font-semibold">الاسم</th>
                                <th className="p-4 text-slate-600 font-semibold">الهاتف</th>
                                <th className="p-4 text-slate-600 font-semibold">البريد الإلكتروني</th>
                                <th className="p-4 text-slate-600 font-semibold">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(customer => (
                                <tr key={customer.id} className="border-b border-slate-200/70">
                                    <td className="p-4 font-medium text-slate-800">{customer.name}</td>
                                    <td className="p-4 text-slate-700" dir="ltr">{customer.phone}</td>
                                    <td className="p-4 text-slate-700">{customer.email || '-'}</td>
                                    <td className="p-4">
                                        <div className="flex space-x-2 space-x-reverse">
                                            <button onClick={() => openEditModal(customer)} className="p-2 rounded-full text-blue-600 bg-slate-100 shadow-[3px_3px_6px_#bec3cf,-3px_-3px_6px_#ffffff] active:shadow-[inset_2px_2px_4px_#bec3cf,inset_-2px_-2px_4px_#ffffff]">
                                                <EditIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDeleteCustomer(customer.id)} className="p-2 rounded-full text-red-600 bg-slate-100 shadow-[3px_3px_6px_#bec3cf,-3px_-3px_6px_#ffffff] active:shadow-[inset_2px_2px_4px_#bec3cf,inset_-2px_-2px_4px_#ffffff]">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {customers.length === 0 && <p className="text-center py-8 text-slate-500">لم تتم إضافة أي عملاء بعد.</p>}
                </div>
            </NeumorphicCard>
        </div>
    );
};

export default Customers;
