
import React from 'react';
import NeumorphicCard from './NeumorphicCard';
import { useAppData } from '../context/AppContext';
import { POSIcon, ProductsIcon, ReportsIcon } from './Icons';

interface DashboardProps {
    setView: (view: 'dashboard' | 'pos' | 'products' | 'customers' | 'expenses' | 'reports') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
    const { sales, products, expenses } = useAppData();

    const today = new Date().toISOString().split('T')[0];

    const todaysSales = sales.filter(sale => sale.createdAt.startsWith(today));
    const totalRevenue = todaysSales.reduce((acc, sale) => acc + sale.total, 0);
    const totalTransactions = todaysSales.length;

    const latestSales = sales.slice(-5).reverse();

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NeumorphicCard className="flex items-center p-6">
                    <div>
                        <p className="text-sm font-medium text-slate-500">مبيعات اليوم</p>
                        <p className="text-3xl font-bold text-slate-800">{totalRevenue.toFixed(2)} د.إ</p>
                    </div>
                </NeumorphicCard>
                <NeumorphicCard className="flex items-center p-6">
                     <div>
                        <p className="text-sm font-medium text-slate-500">عدد المعاملات اليوم</p>
                        <p className="text-3xl font-bold text-slate-800">{totalTransactions}</p>
                    </div>
                </NeumorphicCard>
                <NeumorphicCard className="flex items-center p-6">
                    <div>
                        <p className="text-sm font-medium text-slate-500">إجمالي المصروفات اليوم</p>
                        <p className="text-3xl font-bold text-slate-800">
                            {expenses.filter(e => e.createdAt.startsWith(today)).reduce((sum, e) => sum + e.amount, 0).toFixed(2)} د.إ
                        </p>
                    </div>
                </NeumorphicCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <NeumorphicCard>
                        <h3 className="text-lg font-semibold text-slate-700 mb-4">أحدث المبيعات</h3>
                        <div className="space-y-3">
                            {latestSales.length > 0 ? latestSales.map(sale => (
                                <div key={sale.id} className="flex justify-between items-center p-3 bg-slate-200/50 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-slate-800">معاملة #{sale.id.slice(-6)}</p>
                                        <p className="text-xs text-slate-500">{new Date(sale.createdAt).toLocaleString('ar-AE')}</p>
                                    </div>
                                    <p className="font-bold text-lg text-green-600">{sale.total.toFixed(2)} د.إ</p>
                                </div>
                            )) : <p className="text-slate-500 text-center py-4">لا توجد مبيعات بعد.</p>}
                        </div>
                    </NeumorphicCard>
                </div>
                <div>
                     <NeumorphicCard className="space-y-4">
                         <h3 className="text-lg font-semibold text-slate-700 mb-2">إجراءات سريعة</h3>
                        <button onClick={() => setView('pos')} className="w-full text-right flex items-center p-3 rounded-lg text-slate-700 font-semibold bg-slate-100 shadow-[3px_3px_6px_#bec3cf,-3px_-3px_6px_#ffffff] active:shadow-[inset_3px_3px_6px_#bec3cf,inset_-3px_-3px_6px_#ffffff] transition-all">
                            <POSIcon className="w-6 h-6 ml-3 text-blue-500" />
                            بدء عملية بيع جديدة
                        </button>
                         <button onClick={() => setView('products')} className="w-full text-right flex items-center p-3 rounded-lg text-slate-700 font-semibold bg-slate-100 shadow-[3px_3px_6px_#bec3cf,-3px_-3px_6px_#ffffff] active:shadow-[inset_3px_3px_6px_#bec3cf,inset_-3px_-3px_6px_#ffffff] transition-all">
                            <ProductsIcon className="w-6 h-6 ml-3 text-green-500" />
                            عرض المنتجات
                        </button>
                        <button onClick={() => setView('reports')} className="w-full text-right flex items-center p-3 rounded-lg text-slate-700 font-semibold bg-slate-100 shadow-[3px_3px_6px_#bec3cf,-3px_-3px_6px_#ffffff] active:shadow-[inset_3px_3px_6px_#bec3cf,inset_-3px_-3px_6px_#ffffff] transition-all">
                            <ReportsIcon className="w-6 h-6 ml-3 text-purple-500" />
                            عرض التقارير
                        </button>
                     </NeumorphicCard>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
