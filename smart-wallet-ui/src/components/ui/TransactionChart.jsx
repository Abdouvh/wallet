import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from './Card';

export function TransactionChart({ transactions, currentUserId }) {
    
    // 1. Process Data: Group transactions by date to calculate "Balance History"
    // This is a simplified simulation of balance history based on transactions
    const processData = () => {
        if (!transactions || transactions.length === 0) return [];

        // Sort by date (oldest first) to calculate running balance
        const sortedTx = [...transactions].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        // We don't have historical balance snapshots from backend, so we will just 
        // visualize the "Flow" (Money In vs Money Out) or just raw amounts for now.
        // For a true balance history, we'd need complex backend logic.
        // Let's visualize "Transaction Volume" instead.
        
        return sortedTx.map(tx => {
            const isExpense = tx.sourceAccount?.id === parseInt(currentUserId);
            return {
                date: new Date(tx.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                amount: isExpense ? -tx.amount : tx.amount, // Negative for expense, Positive for income
                type: isExpense ? 'Expense' : 'Income'
            };
        }).slice(-7); // Show only last 7 transactions for cleanliness
    };

    const data = processData();

    if (data.length === 0) {
        return (
            <Card className="p-6 flex items-center justify-center h-64 text-gray-400">
                No data to display
            </Card>
        );
    }

    return (
        <Card className="p-6 flex flex-col h-[300px]">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Activity Overview</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#6B7280', fontSize: 12}}
                            dy={10}
                        />
                        <YAxis 
                            hide
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ stroke: '#4F46E5', strokeWidth: 1 }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="amount" 
                            stroke="#4F46E5" 
                            fillOpacity={1} 
                            fill="url(#colorAmt)" 
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}