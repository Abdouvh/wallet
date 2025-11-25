import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { 
    LogOut, Send, ArrowUpRight, ArrowDownLeft, Wallet, CreditCard, History,
    Loader2, RefreshCcw, Plus, Minus, DollarSign, Home, Settings, User,
    Search, Filter, Shield, Check, Mail, Lock, Users, UserPlus, Bell,
    XCircle, CheckCircle, Trash2, Activity
} from 'lucide-react';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { TransactionChart } from './ui/TransactionChart';

// --- ADMIN COMPONENTS ---

const AdminUsersTab = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if(!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            alert("User deleted.");
            fetchUsers();
        } catch (err) {
            alert("Failed to delete user.");
        }
    };

    if (isLoading) return <div className="p-10 text-center">Loading users...</div>;

    return (
        <Card className="w-full">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">User Management</h3>
                    <p className="text-sm text-gray-500">Manage all registered accounts</p>
                </div>
                <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                    {users.length} Users Total
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-500">#{user.id}</td>
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <img src={user.profilePicture || `https://api.dicebear.com/9.x/initials/svg?seed=${user.username}`} className="w-8 h-8 rounded-full bg-gray-100" alt="" />
                                    <span className="font-medium text-gray-900 capitalize">{user.username}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'ROLE_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {user.role !== 'ROLE_ADMIN' && (
                                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

const AdminTransactionsTab = () => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTx = async () => {
            try {
                const res = await api.get('/admin/transactions');
                setTransactions(res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTx();
    }, []);

    if (isLoading) return <div className="p-10 text-center">Loading transactions...</div>;

    return (
        <Card className="w-full">
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Global Ledger</h3>
                <p className="text-sm text-gray-500">Audit trail of all system movements</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(tx.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {tx.sourceAccount ? `Account #${tx.sourceAccount.id}` : <span className="text-green-600 font-bold">External Deposit</span>}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {tx.targetAccount ? `Account #${tx.targetAccount.id}` : <span className="text-red-600 font-bold">Withdrawal</span>}
                                </td>
                                <td className="px-6 py-4 text-right font-mono font-medium">
                                    ${tx.amount.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

// --- USER COMPONENTS ---

const OverviewTab = ({ account, transactions, setActiveModal, handleTransfer, recipientId, setRecipientId, amount, setAmount, isProcessing }) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <div><p className="text-blue-100 text-sm font-medium mb-1">Total Balance</p><h2 className="text-4xl font-bold tracking-tight">${account.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2></div>
                        <CreditCard className="w-8 h-8 text-blue-200" />
                    </div>
                    <div className="flex gap-4 mt-6">
                        <button onClick={() => setActiveModal('deposit')} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"><Plus className="w-4 h-4" /> Deposit</button>
                        <button onClick={() => setActiveModal('withdraw')} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"><Minus className="w-4 h-4" /> Withdraw</button>
                    </div>
                    <div className="flex justify-between items-end mt-8">
                        <div><p className="text-blue-200 text-xs uppercase tracking-wider mb-1">Account Holder</p><p className="font-medium tracking-wide capitalize">{account.user?.username}</p></div>
                        <div className="text-right"><p className="text-blue-200 text-xs uppercase tracking-wider mb-1">Account ID</p><p className="font-mono font-medium tracking-wider">#{String(account.id).padStart(8, '0')}</p></div>
                    </div>
                </div>
            </div>
            <TransactionChart transactions={transactions} currentUserId={account?.id} />
            <Card className="p-6">
                <div className="flex items-center gap-2 mb-6"><Send className="w-5 h-5 text-blue-600" /><h3 className="text-lg font-bold text-gray-900">Quick Transfer</h3></div>
                <form onSubmit={handleTransfer} className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1"><label className="block text-sm font-medium text-gray-700 mb-1">Recipient ID</label><input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={recipientId} onChange={(e) => setRecipientId(e.target.value)} required /></div>
                    <div className="flex-1"><label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label><input type="number" step="0.01" min="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={amount} onChange={(e) => setAmount(e.target.value)} required /></div>
                    <div className="flex items-end"><button type="submit" disabled={isProcessing} className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 h-[42px]">{isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send</button></div>
                </form>
            </Card>
        </div>
        <div className="lg:col-span-1">
            <Card className="h-full flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between"><div className="flex items-center gap-2"><History className="w-5 h-5 text-blue-600" /><h3 className="text-lg font-bold text-gray-900">History</h3></div><span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{transactions.length}</span></div>
                <div className="flex-1 overflow-y-auto p-4 max-h-[500px] space-y-3">{transactions.length === 0 ? <p className="text-center py-10 text-gray-500">No transactions found.</p> : transactions.map((tx) => { const isOutgoing = tx.sourceAccount?.id === account.id; return (<div key={tx.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100"><div className="flex items-center gap-3"><div className={`p-2 rounded-full ${isOutgoing ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{isOutgoing ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}</div><div><p className="text-sm font-medium text-gray-900">{isOutgoing ? 'Sent to ID: ' + tx.targetAccount?.id : 'Received from: ' + (tx.sourceAccount?.id ? 'ID ' + tx.sourceAccount.id : 'Deposit')}</p><p className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleDateString()}</p></div></div><span className={`font-bold ${isOutgoing ? 'text-gray-900' : 'text-green-600'}`}>{isOutgoing ? '-' : '+'}${tx.amount.toLocaleString()}</span></div>); })}</div>
            </Card>
        </div>
    </div>
);

const ActivityTab = ({ transactions, account, filterType, setFilterType, searchTerm, setSearchTerm }) => {
    const filteredTransactions = transactions.filter(tx => { const isOutgoing = tx.sourceAccount?.id === account.id; if (filterType === 'sent' && !isOutgoing) return false; if (filterType === 'received' && isOutgoing) return false; if (!searchTerm) return true; const term = searchTerm.toLowerCase(); return tx.amount.toString().includes(term) || (tx.targetAccount?.id?.toString() || '').includes(term); });
    return (
        <Card className="w-full">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h3 className="text-lg font-bold text-gray-900">All Transactions</h3></div>
                <div className="flex gap-2"><input type="text" placeholder="Search..." className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /><select className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm" value={filterType} onChange={(e) => setFilterType(e.target.value)}><option value="all">All</option><option value="sent">Sent</option><option value="received">Received</option></select></div>
            </div>
            <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th></tr></thead><tbody className="bg-white divide-y divide-gray-200">{filteredTransactions.map((tx) => { const isOutgoing = tx.sourceAccount?.id === account.id; return (<tr key={tx.id}><td className="px-6 py-4 text-sm text-gray-500">{new Date(tx.timestamp).toLocaleDateString()}</td><td className="px-6 py-4 text-sm text-gray-900">{isOutgoing ? `To Account #${tx.targetAccount?.id}` : (tx.sourceAccount?.id ? `From Account #${tx.sourceAccount.id}` : 'External Deposit')}</td><td className={`px-6 py-4 text-sm text-right font-bold ${isOutgoing ? 'text-gray-900' : 'text-green-600'}`}>{isOutgoing ? '-' : '+'}${tx.amount.toLocaleString()}</td></tr>); })}</tbody></table></div>
        </Card>
    );
};

const SettingsTab = ({ account, refreshData }) => {
    const [selectedAvatar, setSelectedAvatar] = useState(account.user?.profilePicture || '');
    const [email, setEmail] = useState(account.user?.email || '');
    const [password, setPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (account.user) {
            setEmail(account.user.email || '');
            setSelectedAvatar(account.user.profilePicture || '');
        }
    }, [account]);

    const avatarStyles = [
        'adventurer', 'avataaars', 'bottts', 'fun-emoji', 'lorelei', 'notionists'
    ];
    
    const avatarOptions = avatarStyles.map(style => 
        `https://api.dicebear.com/9.x/${style}/svg?seed=${account.user?.username || 'user'}`
    );

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.put(`/users/${account.user.id}`, {
                email,
                password: password || null,
                profilePicture: selectedAvatar
            });
            
            await refreshData(); 
            alert("Settings updated successfully!");
            setPassword(''); 
        } catch (err) {
            console.error(err);
            alert("Update failed: " + (err.response?.data || "Unknown error"));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Profile Appearance</h3>
                
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-24 h-24 rounded-full border-4 border-blue-50 overflow-hidden shadow-sm">
                            <img 
                                src={selectedAvatar || `https://api.dicebear.com/9.x/initials/svg?seed=${account.user?.username}`} 
                                alt="Avatar" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">Preview</span>
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Choose a new look</label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                            {avatarOptions.map((url, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedAvatar(url)}
                                    className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${selectedAvatar === url ? 'border-blue-600 ring-2 ring-blue-100 scale-110' : 'border-gray-200 hover:border-blue-300'}`}
                                >
                                    <img src={url} alt={`Avatar option ${index}`} className="w-full h-full" />
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-3">Select an avatar and click "Save Changes" below.</p>
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">Security & Contact</h3>
                </div>
                
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input 
                                type="password" 
                                placeholder="Leave blank to keep current password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button 
                            onClick={handleSave} 
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-sm disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const ContactsTab = ({ userId, onSelectContact }) => {
    const [contacts, setContacts] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newContact, setNewContact] = useState({ name: '', email: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await api.get(`/contacts/${userId}`);
            setContacts(res.data);
        } catch (err) {
            console.error("Failed to fetch contacts", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddContact = async (e) => {
        e.preventDefault();
        try {
            await api.post('/contacts/add', {
                userId,
                name: newContact.name,
                email: newContact.email
            });
            alert("Contact added!");
            setNewContact({ name: '', email: '' });
            setShowAddForm(false);
            fetchContacts();
        } catch (err) {
            alert("Failed to add contact: " + (err.response?.data || "Unknown error"));
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">My Contacts</h3>
                    <p className="text-sm text-gray-500">Manage your beneficiaries</p>
                </div>
                <button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    <UserPlus className="w-4 h-4" /> Add Contact
                </button>
            </div>

            {showAddForm && (
                <Card className="p-6 bg-blue-50 border-blue-100">
                    <h4 className="font-bold text-gray-900 mb-4">Add New Beneficiary</h4>
                    <form onSubmit={handleAddContact} className="flex flex-col sm:flex-row gap-4">
                        <input 
                            type="text" 
                            placeholder="Nickname (e.g. Mom)" 
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newContact.name}
                            onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                            required
                        />
                        <input 
                            type="text" 
                            placeholder="Username or Email" 
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newContact.email}
                            onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                            required
                        />
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                            Save
                        </button>
                    </form>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contacts.length === 0 && !isLoading ? (
                    <div className="col-span-2 text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                        <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p>No contacts yet. Add one to send money faster!</p>
                    </div>
                ) : (
                    contacts.map(contact => (
                        <Card key={contact.id} className="p-4 flex items-center justify-between hover:border-blue-200 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {contact.contactName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{contact.contactName}</h4>
                                    <p className="text-xs text-gray-500">ID: {contact.accountId}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => onSelectContact(contact.accountId)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 flex items-center gap-1"
                            >
                                <Send className="w-3 h-3" /> Send
                            </button>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

const RequestsTab = ({ userId, refreshData }) => {
    const [incoming, setIncoming] = useState([]);
    const [outgoing, setOutgoing] = useState([]);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [newRequest, setNewRequest] = useState({ payerId: '', amount: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const [inRes, outRes] = await Promise.all([
                api.get(`/requests/${userId}/incoming`),
                api.get(`/requests/${userId}/outgoing`)
            ]);
            setIncoming(inRes.data);
            setOutgoing(outRes.data);
        } catch (err) {
            console.error("Failed to fetch requests", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateRequest = async (e) => {
        e.preventDefault();
        try {
            await api.post('/requests/create', {
                requesterId: userId,
                payerId: newRequest.payerId,
                amount: parseFloat(newRequest.amount)
            });
            alert("Request sent!");
            setShowRequestForm(false);
            setNewRequest({ payerId: '', amount: '' });
            fetchRequests();
        } catch (err) {
            alert("Failed to send request: " + (err.response?.data || "Error"));
        }
    };

    const handlePay = async (requestId) => {
        try {
            await api.post(`/requests/${requestId}/pay`);
            alert("Paid successfully!");
            fetchRequests();
            refreshData(); // Update balance
        } catch (err) {
            alert("Payment failed: " + (err.response?.data || "Error"));
        }
    };

    const handleDecline = async (requestId) => {
        try {
            await api.post(`/requests/${requestId}/decline`);
            alert("Declined.");
            fetchRequests();
        } catch (err) {
            alert("Decline failed: " + (err.response?.data || "Error"));
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Payment Requests</h3>
                <button 
                    onClick={() => setShowRequestForm(!showRequestForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    <Plus className="w-4 h-4" /> New Request
                </button>
            </div>

            {showRequestForm && (
                <Card className="p-6 bg-blue-50 border-blue-100">
                    <h4 className="font-bold text-gray-900 mb-4">Ask for Money</h4>
                    <form onSubmit={handleCreateRequest} className="flex flex-col sm:flex-row gap-4">
                        <input 
                            type="number" 
                            placeholder="Payer User ID" 
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newRequest.payerId}
                            onChange={(e) => setNewRequest({...newRequest, payerId: e.target.value})}
                            required
                        />
                        <input 
                            type="number" 
                            placeholder="Amount ($)" 
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newRequest.amount}
                            onChange={(e) => setNewRequest({...newRequest, amount: e.target.value})}
                            required
                        />
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                            Send Request
                        </button>
                    </form>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Incoming Requests (To Pay) */}
                <Card className="p-0 overflow-hidden">
                    <div className="p-4 bg-red-50 border-b border-red-100">
                        <h4 className="font-bold text-red-800 flex items-center gap-2">
                            <ArrowDownLeft className="w-4 h-4" /> Incoming (To Pay)
                        </h4>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {incoming.length === 0 ? (
                            <p className="p-6 text-center text-gray-500 text-sm">No pending requests.</p>
                        ) : (
                            incoming.map(req => (
                                <div key={req.id} className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">From: {req.requester.username}</p>
                                        <p className="text-xs text-gray-500">{new Date(req.timestamp).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">${req.amount}</p>
                                        {req.status === 'PENDING' ? (
                                            <div className="flex gap-2 mt-2">
                                                <button onClick={() => handlePay(req.id)} className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"><CheckCircle className="w-4 h-4" /></button>
                                                <button onClick={() => handleDecline(req.id)} className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"><XCircle className="w-4 h-4" /></button>
                                            </div>
                                        ) : (
                                            <span className={`text-xs px-2 py-1 rounded-full ${req.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {req.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Outgoing Requests (Waiting) */}
                <Card className="p-0 overflow-hidden">
                    <div className="p-4 bg-blue-50 border-b border-blue-100">
                        <h4 className="font-bold text-blue-800 flex items-center gap-2">
                            <ArrowUpRight className="w-4 h-4" /> Outgoing (Waiting)
                        </h4>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {outgoing.length === 0 ? (
                            <p className="p-6 text-center text-gray-500 text-sm">You haven't requested money.</p>
                        ) : (
                            outgoing.map(req => (
                                <div key={req.id} className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">To: {req.payer.username}</p>
                                        <p className="text-xs text-gray-500">{new Date(req.timestamp).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">${req.amount}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : (req.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}`}>
                                            {req.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

// --- MAIN DASHBOARD ---

const Dashboard = () => {
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [recipientId, setRecipientId] = useState('');
    const [amount, setAmount] = useState('');
    const [activeModal, setActiveModal] = useState(null);
    const [modalAmount, setModalAmount] = useState('');
    
    // Logic to set default tab based on Role
    const [activeTab, setActiveTab] = useState('overview'); 
    
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!userId) { navigate('/login'); return; }
        fetchData();
    }, []);

    // Update active tab when account loads if Admin
    useEffect(() => {
        if (account?.user?.role === 'ROLE_ADMIN' && activeTab === 'overview') {
            setActiveTab('admin_users');
        }
    }, [account]);

    const fetchData = async () => {
        if(!account) setIsLoading(true); 
        try {
            const [balanceRes, historyRes] = await Promise.all([
                api.get(`/wallet/${userId}/balance`),
                api.get(`/wallet/${userId}/transactions`)
            ]);
            setAccount(balanceRes.data);
            setTransactions(historyRes.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
        } catch (err) {
            console.error(err);
            if(err.response?.status === 403) navigate('/login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            await api.post('/wallet/transfer', { sourceAccountId: account.id, targetAccountId: recipientId, amount: parseFloat(amount) });
            setAmount(''); setRecipientId(''); await fetchData(); alert("Transfer Successful!");
        } catch (err) { alert("Transfer Failed"); } finally { setIsProcessing(false); }
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            const endpoint = activeModal === 'deposit' ? '/wallet/deposit' : '/wallet/withdraw';
            await api.post(endpoint, { accountId: account.id, amount: parseFloat(modalAmount) });
            setModalAmount(''); setActiveModal(null); await fetchData();
        } catch (err) { alert("Failed"); } finally { setIsProcessing(false); }
    };

    const handleContactSelect = (id) => { setRecipientId(id); setActiveTab('overview'); };
    const handleLogout = () => { localStorage.clear(); navigate('/login'); };

    if (isLoading && !account) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

    const isAdmin = account.user?.role === 'ROLE_ADMIN';

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <div className={`${isAdmin ? 'bg-purple-600' : 'bg-blue-600'} p-2 rounded-lg`}><Wallet className="w-5 h-5 text-white" /></div>
                                <span className="text-xl font-bold text-gray-900 hidden sm:block">{isAdmin ? 'Admin Portal' : 'Smart Wallet'}</span>
                            </div>
                            
                            <div className="hidden md:flex items-center gap-1">
                                {isAdmin ? (
                                    <>
                                        <button onClick={() => setActiveTab('admin_users')} className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'admin_users' ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                                            <Users className="w-4 h-4" /> Users
                                        </button>
                                        <button onClick={() => setActiveTab('admin_transactions')} className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'admin_transactions' ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                                            <Activity className="w-4 h-4" /> Global Ledger
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'overview' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}><Home className="w-4 h-4" /> Overview</button>
                                        <button onClick={() => setActiveTab('requests')} className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'requests' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}><Bell className="w-4 h-4" /> Requests</button>
                                        <button onClick={() => setActiveTab('contacts')} className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'contacts' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}><Users className="w-4 h-4" /> Contacts</button>
                                        <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'settings' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}><Settings className="w-4 h-4" /> Settings</button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 pr-4 border-r border-gray-200">
                                <img src={account.user?.profilePicture || `https://api.dicebear.com/9.x/initials/svg?seed=${account.user?.username}`} className="w-8 h-8 rounded-full bg-gray-100" />
                                <span className="text-sm font-medium text-gray-700 capitalize">{account.user ? account.user.username : 'User'}</span>
                            </div>
                            <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 px-4 py-2 rounded-lg transition-colors"><LogOut className="w-4 h-4" /><span className="hidden sm:inline">Logout</span></button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-0"> 
                {isAdmin ? (
                    <>
                        {activeTab === 'admin_users' && <AdminUsersTab />}
                        {activeTab === 'admin_transactions' && <AdminTransactionsTab />}
                    </>
                ) : (
                    <>
                        {activeTab === 'overview' && <OverviewTab account={account} transactions={transactions} setActiveModal={setActiveModal} handleTransfer={handleTransfer} recipientId={recipientId} setRecipientId={setRecipientId} amount={amount} setAmount={setAmount} isProcessing={isProcessing} />}
                        {activeTab === 'requests' && <RequestsTab userId={userId} refreshData={fetchData} />}
                        {activeTab === 'contacts' && <ContactsTab userId={userId} onSelectContact={handleContactSelect} />}
                        {activeTab === 'settings' && <SettingsTab account={account} refreshData={fetchData} />}
                    </>
                )}
            </main>

            {/* Deposit/Withdraw Modal */}
            <Modal isOpen={!!activeModal} onClose={() => setActiveModal(null)} title={activeModal === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}>
                {/* ... (Modal content remains the same) */}
                <form onSubmit={handleModalSubmit} className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><DollarSign className="h-5 w-5 text-gray-400" /></div><input type="number" autoFocus step="0.01" min="0.01" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" value={modalAmount} onChange={(e) => setModalAmount(e.target.value)} required /></div></div>
                    <div className="flex gap-3 pt-2"><button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl">Cancel</button><button type="submit" disabled={isProcessing} className={`flex-1 py-3 px-4 text-white font-bold rounded-xl flex items-center justify-center gap-2 ${activeModal === 'deposit' ? 'bg-green-600' : 'bg-red-600'}`}>{isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{activeModal === 'deposit' ? 'Confirm' : 'Confirm'}</>}</button></div>
                </form>
            </Modal>
        </div>
    );
};

export default Dashboard;