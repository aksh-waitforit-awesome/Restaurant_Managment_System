import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const Unauthorized = () => {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    const handleSwitchAccount = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Restricted Access</h1>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Your current account does not have permission to view this page. 
                    Please contact your manager if you believe this is an error.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Go Back
                    </button>
                    <button 
                        onClick={handleSwitchAccount}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all"
                    >
                        Login as Staff
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;