import { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, Loader2, Wallet, DollarSign } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        initialBalance: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            // Optional delay for UI effect
            await new Promise(resolve => setTimeout(resolve, 800));

            await api.post('/users/register', {
                username: formData.username,
                password: formData.password,
                initialBalance: parseFloat(formData.initialBalance)
            });

            // Success!
            alert("Registration Successful! Please login.");
            navigate('/login');

        } catch (err) {
            console.error(err);
            setError(err.response?.data || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left Side - Visual & Branding */}
            <div className="hidden lg:flex w-1/2 bg-indigo-600 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-900 opacity-90"></div>
                
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full opacity-10 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
                </div>

                <div className="relative z-10 text-white text-left p-12 max-w-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Wallet className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Smart Wallet</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Join the future of banking.
                    </h1>
                    <p className="text-indigo-100 text-lg leading-relaxed">
                        Create an account in seconds. Experience seamless transactions, real-time tracking, and secure savings management.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                        <p className="text-gray-500 mt-2">Start your financial journey today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                </div>
                                <input 
                                    type="text" 
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
                                    placeholder="Choose a username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                </div>
                                <input 
                                    type="password" 
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        {/* Initial Deposit */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Initial Deposit ($)</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <DollarSign className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                </div>
                                <input 
                                    type="number" 
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
                                    placeholder="e.g. 1000.00"
                                    value={formData.initialBalance}
                                    onChange={(e) => setFormData({...formData, initialBalance: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                <p className="text-sm text-red-600 font-medium">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Sign Up
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;