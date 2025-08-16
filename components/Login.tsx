
import React, { useState } from 'react';
import { useAuth } from '../context/AppContext';
import NeumorphicCard from './NeumorphicCard';
import NeumorphicButton from './NeumorphicButton';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isManager, setIsManager] = useState(false);
    const { login } = useAuth();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            login(email, isManager);
        } else {
            alert('يرجى إدخال البريد الإلكتروني');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <NeumorphicCard className="w-full max-w-sm">
                <div className="text-center">
                     <h1 className="text-4xl font-bold text-slate-800 mb-2">حساباتي</h1>
                    <p className="text-slate-500 mb-8">تسجيل الدخول للمتابعة</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-2">البريد الإلكتروني</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-100 rounded-lg text-slate-700 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-shadow duration-200 shadow-[inset_5px_5px_10px_#bec3cf,inset_-5px_-5px_10px_#ffffff]"
                            placeholder="user@example.com"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="manager" className="text-sm font-medium text-slate-600">تسجيل الدخول كمدير؟</label>
                        <div 
                            onClick={() => setIsManager(!isManager)}
                            className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-all duration-300 ${isManager ? 'bg-blue-500' : 'bg-slate-200'}`}
                        >
                            <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${isManager ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                    </div>
                    <div>
                        <NeumorphicButton onClick={() => {}} className="w-full !py-3 !text-lg !font-bold">
                            تسجيل الدخول
                        </NeumorphicButton>
                    </div>
                </form>
                 <div className="mt-6 text-center">
                    <p className="text-xs text-slate-400">
                        لا يوجد مصادقة حقيقية. أدخل أي بريد إلكتروني للمتابعة.
                    </p>
                </div>
            </NeumorphicCard>
        </div>
    );
};

export default Login;
