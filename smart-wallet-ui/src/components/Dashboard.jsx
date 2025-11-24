import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [recipientId, setRecipientId] = useState('');
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();
    
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // 1. Get Balance
            const balanceRes = await api.get(`/wallet/${userId}/balance`);
            setAccount(balanceRes.data);

            // 2. Get History
            const historyRes = await api.get(`/wallet/${userId}/transactions`);
            setTransactions(historyRes.data);
        } catch (err) {
            console.error("Error fetching data", err);
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        try {
            await api.post('/wallet/transfer', {
                sourceAccountId: account.id,
                targetAccountId: recipientId, // In a real app, you'd look up by username first
                amount: parseFloat(amount)
            });
            alert("Transfer Successful!");
            setAmount('');
            setRecipientId('');
            fetchData(); // Refresh balance/history
        } catch (err) {
            alert("Transfer Failed: " + (err.response?.data || "Unknown Error"));
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (!account) return <div className="p-10">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Smart Wallet Dashboard</h1>
                    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        Logout
                    </button>
                </div>

                {/* Balance Card */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-l-4 border-blue-500">
                    <h2 className="text-gray-500 uppercase text-sm font-semibold">Current Balance</h2>
                    <p className="text-4xl font-bold text-gray-800 mt-2">${account.balance}</p>
                    <p className="text-gray-400 text-sm mt-1">Account ID: {account.id}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Transfer Form */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold mb-4">Send Money</h3>
                        <form onSubmit={handleTransfer}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Recipient Account ID</label>
                                <input 
                                    type="number" 
                                    className="w-full p-2 border rounded"
                                    placeholder="e.g. 2"
                                    value={recipientId}
                                    onChange={(e) => setRecipientId(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Amount</label>
                                <input 
                                    type="number" 
                                    className="w-full p-2 border rounded"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 font-bold">
                                Transfer Funds
                            </button>
                        </form>
                    </div>

                    {/* Transaction History */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
                        <div className="overflow-y-auto max-h-64">
                            {transactions.length === 0 ? (
                                <p className="text-gray-500">No transactions yet.</p>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {transactions.map((tx) => (
                                        <li key={tx.id} className="py-3 flex justify-between text-sm">
                                            <div>
                                                <span className={`font-bold ${tx.sourceAccount?.id === account.id ? 'text-red-500' : 'text-green-500'}`}>
                                                    {tx.sourceAccount?.id === account.id ? 'Sent' : 'Received'}
                                                </span>
                                                <span className="text-gray-500 ml-2">
                                                    {new Date(tx.timestamp).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <span className="font-bold">${tx.amount}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;