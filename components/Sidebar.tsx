
import React from 'react';
import {
  DashboardIcon,
  POSIcon,
  ProductsIcon,
  CustomersIcon,
  ExpensesIcon,
  ReportsIcon,
  LogoutIcon,
  UserIcon
} from './Icons';
import { useAuth } from '../context/AppContext';

type View = 'dashboard' | 'pos' | 'products' | 'customers' | 'expenses' | 'reports';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  onLogout: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 text-right rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-slate-100 text-blue-600 shadow-[inset_5px_5px_10px_#bec3cf,inset_-5px_-5px_10px_#ffffff]'
          : 'text-slate-600 hover:bg-slate-200/60'
      }`}
    >
      <span className="ml-4">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout }) => {
    const { user } = useAuth();
    
    const navItems: { view: View; label: string; icon: React.ReactNode }[] = [
        { view: 'dashboard', label: 'لوحة التحكم', icon: <DashboardIcon className="w-6 h-6" /> },
        { view: 'pos', label: 'نقطة البيع', icon: <POSIcon className="w-6 h-6" /> },
        { view: 'products', label: 'المنتجات', icon: <ProductsIcon className="w-6 h-6" /> },
        { view: 'customers', label: 'العملاء', icon: <CustomersIcon className="w-6 h-6" /> },
        { view: 'expenses', label: 'المصروفات', icon: <ExpensesIcon className="w-6 h-6" /> },
        { view: 'reports', label: 'التقارير', icon: <ReportsIcon className="w-6 h-6" /> },
    ];

    return (
        <aside className="w-64 bg-slate-100 flex flex-col p-4 shadow-[5px_0px_15px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-center mb-10 pt-4">
                 <h1 className="text-3xl font-bold text-slate-800">حساباتي</h1>
            </div>
            <nav className="flex-1 space-y-3">
                 {navItems.map((item) => (
                    <NavItem
                        key={item.view}
                        icon={item.icon}
                        label={item.label}
                        isActive={currentView === item.view}
                        onClick={() => setView(item.view)}
                    />
                ))}
            </nav>
            <div className="mt-auto">
                {user && (
                    <div className="p-3 mb-3 bg-slate-200/70 rounded-lg text-slate-700">
                        <div className="flex items-center">
                           <UserIcon className="w-8 h-8 p-1.5 bg-slate-100 rounded-full shadow-[inset_1px_1px_2px_#bec3cf,inset_-1px_-1px_2px_#ffffff]"/>
                           <div className="mr-3">
                               <p className="font-semibold text-sm truncate">{user.email}</p>
                               <p className="text-xs text-slate-500">{user.isManager ? 'مدير' : 'موظف'}</p>
                           </div>
                        </div>
                    </div>
                )}
                <NavItem
                    icon={<LogoutIcon className="w-6 h-6" />}
                    label="تسجيل الخروج"
                    isActive={false}
                    onClick={onLogout}
                />
            </div>
        </aside>
    );
};

export default Sidebar;
