
import React, { useState } from 'react';
import { useAppData } from '../context/AppContext';
import { Expense } from '../types';
import NeumorphicCard from './NeumorphicCard';
import NeumorphicButton from './NeumorphicButton';
import { TrashIcon } from './Icons';

const Expenses: React.FC = () => {
    const { expenses, setExpenses } = useAppData();
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState<number | ''>('');

    const handleAddExpense = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || amount === '' || amount <= 0) {
            alert('يرجى إدخال وصف ومبلغ صحيح.');
            return;
        }

        const newExpense: Expense = {
            id: `exp-${Date.now()}`,
            description,
            amount: Number(amount),
            createdAt: new Date().toISOString(),
        };

        setExpenses([...expenses, newExpense]);
        setDescription('');
        setAmount('');
    };

    const handleDeleteExpense = (expenseId: string) => {
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المصروف؟')) {
            setExpenses(expenses.filter(exp => exp.id !== expenseId));
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Expense Form */}
            <div className="lg:col-span-1">
                <NeumorphicCard>
                    <h2 className="text-xl font-bold text-slate-800 mb-4">إضافة مصروف جديد</h2>
                    <form onSubmit={handleAddExpense} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">الوصف</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="مثال: فاتورة الكهرباء"
                                className="w-full p-3 bg-slate-100 rounded-lg shadow-[inset_3px_3px_6px_#bec3cf,inset_-3px_-3px_6px_#ffffff]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">المبلغ</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                placeholder="0.00"
                                min="0.01"
                                step="0.01"
                                className="w-full p-3 bg-slate-100 rounded-lg shadow-[inset_3px_3px_6px_#bec3cf,inset_-3px_-3px_6px_#ffffff]"
                            />
                        </div>
                        <div className="pt-2">
                           <NeumorphicButton onClick={() => {}} className="w-full !py-2.5 !bg-blue-500 !text-white !shadow-[5px_5px_10px_#428eff,-5px_-5px_10px_#64a9ff]">
                                إضافة مصروف
                            </NeumorphicButton>
                        </div>
                    </form>
                </NeumorphicCard>
            </div>

            {/* Expenses List */}
            <div className="lg:col-span-2">
                <NeumorphicCard>
                     <h2 className="text-xl font-bold text-slate-800 mb-4">قائمة المصروفات</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="border-b-2 border-slate-200">
                                <tr>
                                    <th className="p-4 text-slate-600 font-semibold">الوصف</th>
                                    <th className="p-4 text-slate-600 font-semibold">المبلغ</th>
                                    <th className="p-4 text-slate-600 font-semibold">التاريخ</th>
                                    <th className="p-4 text-slate-600 font-semibold">إجراء</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.slice().reverse().map(expense => (
                                    <tr key={expense.id} className="border-b border-slate-200/70">
                                        <td className="p-4 font-medium text-slate-800">{expense.description}</td>
                                        <td className="p-4 text-slate-700">{expense.amount.toFixed(2)} د.إ</td>
                                        <td className="p-4 text-slate-700">{new Date(expense.createdAt).toLocaleDateString('ar-AE')}</td>
                                        <td className="p-4">
                                            <button onClick={() => handleDeleteExpense(expense.id)} className="p-2 rounded-full text-red-600 bg-slate-100 shadow-[3px_3px_6px_#bec3cf,-3px_-3px_6px_#ffffff] active:shadow-[inset_2px_2px_4px_#bec3cf,inset_-2px_-2px_4px_#ffffff]">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {expenses.length === 0 && <p className="text-center py-8 text-slate-500">لا توجد مصروفات مسجلة.</p>}
                    </div>
                </NeumorphicCard>
            </div>
        </div>
    );
};

export default Expenses;
