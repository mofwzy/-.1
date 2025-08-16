
import React, { useState, useCallback, useEffect } from 'react';
import { AppProvider, useAuth } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import POS from './components/POS';
import Products from './components/Products';
import Customers from './components/Customers';
import Expenses from './components/Expenses';
import Reports from './components/Reports';
import Login from './components/Login';
import { SyncIcon, WifiOnIcon, WifiOffIcon } from './components/Icons';

type View = 'dashboard' | 'pos' | 'products' | 'customers' | 'expenses' | 'reports';

const MainApp = () => {
    const [view, setView] = useState<View>('dashboard');
    const { isAuthenticated, user, logout } = useAuth();
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleSync = useCallback(() => {
        if (!isOnline) {
            alert("لا يمكن المزامنة. أنت غير متصل بالإنترنت.");
            return;
        }
        setIsSyncing(true);
        console.log("Starting data sync...");
        // Simulate a network request
        setTimeout(() => {
            setIsSyncing(false);
            console.log("Sync complete!");
            alert("تمت مزامنة البيانات بنجاح!");
        }, 2000);
    }, [isOnline]);

    if (!isAuthenticated) {
        return <Login />;
    }

    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <Dashboard setView={setView} />;
            case 'pos':
                return <POS />;
            case 'products':
                return <Products isAdmin={user?.isManager ?? false} />;
            case 'customers':
                return <Customers />;
            case 'expenses':
                return <Expenses />;
            case 'reports':
                return <Reports />;
            default:
                return <Dashboard setView={setView} />;
        }
    };

    return (
        <div className="flex h-screen bg-slate-100 font-sans">
            <Sidebar currentView={view} setView={setView} onLogout={logout} />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 capitalize">{view.replace('_', ' ')}</h1>
                    <div className="flex items-center space-x-4 space-x-reverse">
                         <div className={`flex items-center space-x-2 space-x-reverse px-3 py-1.5 rounded-full text-sm ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {isOnline ? <WifiOnIcon className="w-5 h-5" /> : <WifiOffIcon className="w-5 h-5" />}
                            <span>{isOnline ? 'متصل' : 'غير متصل'}</span>
                        </div>
                        <button
                            onClick={handleSync}
                            disabled={isSyncing || !isOnline}
                            className="flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-full text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 shadow-[3px_3px_6px_#cdd4e0,-3px_-3px_6px_#ffffff]"
                        >
                            <SyncIcon className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                            <span>{isSyncing ? 'جاري المزامنة...' : 'مزامنة'}</span>
                        </button>
                    </div>
                </header>
                {renderView()}
            </main>
        </div>
    );
};


const App = () => {
    return (
        <AppProvider>
            <MainApp />
        </AppProvider>
    );
}

export default App;

