import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur effect */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all scale-100 border border-gray-100">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Body */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}