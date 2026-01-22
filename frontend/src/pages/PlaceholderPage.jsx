import React from 'react';
import { Construction } from 'lucide-react';

const PlaceholderPage = ({ title }) => {
    return (
        <div className="h-screen flex flex-col items-center justify-center p-8 text-center text-black/50">
            <div className="w-24 h-24 mb-6 rounded-3xl bg-black/5 flex items-center justify-center animate-pulse">
                <Construction size={48} className="opacity-50" />
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-4">{title}</h1>
            <p className="font-bold tracking-widest text-xs uppercase opacity-50">This section is under construction.</p>
        </div>
    );
};

export default PlaceholderPage;
