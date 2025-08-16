
import React, { useMemo } from 'react';
import { useAppData } from '../context/AppContext';
import NeumorphicCard from './NeumorphicCard';
import { Sale } from '../types';

interface ReportData {
    totalRevenue: number;
    transactionCount: number;
    topProducts: { name: string; quantity: number; revenue: number }[];
}

const processSalesData = (sales: Sale[]): ReportData => {
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const transactionCount = sales.length;
    
    const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    sales.forEach(sale => {
        sale.items.forEach(item => {
            const existing = productSales.get(item.productId);
            if (existing) {
                existing.quantity += item.quantity;
                existing.revenue += item.quantity * item.price;
            } else {
                productSales.set(item.productId, {
                    name: item.productName,
                    quantity: item.quantity,
                    revenue: item.quantity * item.price,
                });
            }
        });
    });

    const topProducts = Array.from(productSales.values())
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
        
    return { totalRevenue, transactionCount, topProducts };
};

const ReportSection: React.FC<{ title: string; data: ReportData }> = ({ title, data }) => {
    return (
        <NeumorphicCard>
            <h3 className="text-xl font-bold text-slate-800 mb-4">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-200/50 rounded-lg">
                    <p className="text-sm text-slate-600">إجمالي الإيرادات</p>
                    <p className="text-2xl font-bold text-green-600">{data.totalRevenue.toFixed(2)} د.إ</p>
                </div>
                <div className="p-4 bg-slate-200/50 rounded-lg">
                    <p className="text-sm text-slate-600">عدد المعاملات</p>
                    <p className="text-2xl font-bold text-blue-600">{data.transactionCount}</p>
                </div>
            </div>
            
            <h4 className="font-semibold text-slate-700 mb-2">أفضل المنتجات مبيعًا</h4>
            {data.topProducts.length > 0 ? (
                <ul className="space-y-2">
                    {data.topProducts.map(p => (
                        <li key={p.name} className="flex justify-between items-center p-2 bg-slate-100 rounded-md shadow-[inset_2px_2px_4px_#bec3cf,inset_-2px_-2px_4px_#ffffff]">
                            <span className="font-medium text-slate-800">{p.name}</span>
                            <span className="text-sm text-slate-500">
                                بيعت {p.quantity} مرة | إيرادات {p.revenue.toFixed(2)} د.إ
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-slate-500">لا توجد بيانات كافية.</p>
            )}
        </NeumorphicCard>
    );
};

const Reports: React.FC = () => {
    const { sales } = useAppData();

    const dailyReportData = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dailySales = sales.filter(s => new Date(s.createdAt) >= today);
        return processSalesData(dailySales);
    }, [sales]);

    const weeklyReportData = useMemo(() => {
        const today = new Date();
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        firstDayOfWeek.setHours(0, 0, 0, 0);
        const weeklySales = sales.filter(s => new Date(s.createdAt) >= firstDayOfWeek);
        return processSalesData(weeklySales);
    }, [sales]);

    return (
        <div className="space-y-8">
            <ReportSection title="تقرير اليوم" data={dailyReportData} />
            <ReportSection title="تقرير الأسبوع" data={weeklyReportData} />
        </div>
    );
};

export default Reports;
