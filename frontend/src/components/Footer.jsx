import React from 'react';
import { Music2, Instagram, Twitter, Facebook, Mail, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-24 pb-32 border-t border-white/10 mt-24">
            <div className="section-padding grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
                <div className="space-y-6 md:col-span-2">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center">
                            <Music2 size={24} />
                        </div>
                        <h2 className="text-3xl font-black italic tracking-tighter uppercase">SurVerse</h2>
                    </div>
                    <p className="text-white/40 max-w-md text-lg leading-relaxed">
                        Experience music like never before. The next generation of audio streaming, designed for the audiophile in you.
                    </p>
                </div>
                
                <div className="space-y-6">
                    <h4 className="font-bold uppercase tracking-widest text-xs opacity-40">Company</h4>
                    <ul className="space-y-4 font-medium opacity-80">
                        <li className="hover:text-white hover:opacity-100 cursor-pointer transition-opacity">About</li>
                        <li className="hover:text-white hover:opacity-100 cursor-pointer transition-opacity">Careers</li>
                        <li className="hover:text-white hover:opacity-100 cursor-pointer transition-opacity">Press</li>
                        <li className="hover:text-white hover:opacity-100 cursor-pointer transition-opacity">News</li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="font-bold uppercase tracking-widest text-xs opacity-40">Support</h4>
                    <ul className="space-y-4 font-medium opacity-80">
                        <li className="hover:text-white hover:opacity-100 cursor-pointer transition-opacity">Help Center</li>
                        <li className="hover:text-white hover:opacity-100 cursor-pointer transition-opacity">Privacy Policy</li>
                        <li className="hover:text-white hover:opacity-100 cursor-pointer transition-opacity">Terms of Service</li>
                        <li className="hover:text-white hover:opacity-100 cursor-pointer transition-opacity">Contact Us</li>
                    </ul>
                </div>
            </div>

            <div className="section-padding flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
                <p className="text-xs font-bold opacity-30 tracking-widest uppercase">&copy; 2026 SurVerse Music. All rights reserved.</p>
                <div className="flex gap-8 mt-8 md:mt-0">
                    <Instagram size={20} className="opacity-40 hover:opacity-100 transition-opacity cursor-pointer" />
                    <Twitter size={20} className="opacity-40 hover:opacity-100 transition-opacity cursor-pointer" />
                    <Facebook size={20} className="opacity-40 hover:opacity-100 transition-opacity cursor-pointer" />
                    <Mail size={20} className="opacity-40 hover:opacity-100 transition-opacity cursor-pointer" />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
