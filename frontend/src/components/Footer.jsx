import React from 'react';
import { Music2, Instagram, Twitter, Facebook, Mail, Heart, ArrowRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative bg-black text-white pt-24 pb-12 overflow-hidden mt-24 rounded-t-[3rem]">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="section-padding relative z-10">
                {/* Newsletter Section */}
                <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12 border-b border-white/10 pb-24">
                    <div className="max-w-xl">
                        <span className="inline-block px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs font-bold tracking-widest uppercase mb-6">Stay Connected</span>
                        <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-6">
                            Join the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Sonic Revolution.</span>
                        </h2>
                        <p className="text-white/60 text-lg leading-relaxed">
                            Get exclusive access to new releases, artist interviews, and behind-the-scenes content delivered straight to your inbox.
                        </p>
                    </div>
                    <div className="w-full md:w-auto flex-1 max-w-md">
                        <form className="flex flex-col gap-4">
                            <input 
                                type="email" 
                                placeholder="Enter your email address" 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
                            />
                            <button className="bg-white text-black font-black uppercase tracking-widest px-8 py-4 rounded-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                                Subscribe Now <ArrowRight size={18} />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-12 gap-12 md:gap-8 mb-24">
                    <div className="col-span-2 md:col-span-4 space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center">
                                <Music2 size={24} />
                            </div>
                            <h2 className="text-2xl font-black italic tracking-tighter uppercase">SurVerse</h2>
                        </div>
                        <p className="text-white/40 text-sm leading-loose max-w-xs">
                            Redefining the way you experience audio. High-fidelity streaming, curated moods, and a community of true music lovers.
                        </p>
                    </div>
                    
                    <div className="md:col-span-2 space-y-6">
                        <h4 className="font-bold uppercase tracking-widest text-xs opacity-40">Dicovery</h4>
                        <ul className="space-y-3 font-medium text-sm text-white/60">
                            <li className="hover:text-white cursor-pointer transition-colors">New Arrivals</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Curated Playlists</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Mood Station</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Genres</li>
                        </ul>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <h4 className="font-bold uppercase tracking-widest text-xs opacity-40">Company</h4>
                        <ul className="space-y-3 font-medium text-sm text-white/60">
                            <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
                            <li className="hover:text-white cursor-pointer transition-colors">For Artists</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Developers</li>
                        </ul>
                    </div>

                     <div className="md:col-span-2 space-y-6">
                        <h4 className="font-bold uppercase tracking-widest text-xs opacity-40">Support</h4>
                        <ul className="space-y-3 font-medium text-sm text-white/60">
                            <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Cookie Settings</li>
                        </ul>
                    </div>

                    <div className="col-span-2 md:col-span-2 space-y-6">
                         <h4 className="font-bold uppercase tracking-widest text-xs opacity-40">Socials</h4>
                         <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                                <Facebook size={18} />
                            </a>
                         </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
                    <p className="text-[10px] md:text-xs font-bold opacity-30 tracking-widest uppercase text-center md:text-left">
                        &copy; 2026 SurVerse Music. Made with <Heart size={50} className="inline mx-1 text-red-500 fill-current" /> BY Naseer Pasha
                    </p>
                    <div className="flex gap-6 text-[10px] md:text-xs font-bold opacity-30 uppercase tracking-widest">
                        <span className="hover:text-white cursor-pointer transition-colors">English (US)</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Mars (Beta)</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
