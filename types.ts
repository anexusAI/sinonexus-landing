import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Shield, Users, ArrowRight, Smartphone, Building2, Menu, X, Send } from 'lucide-react';
import { Language } from './types';
import { getTranslation } from './i18n';
import { ChatWidget } from './components/ChatWidget';
import { FounderDashboard } from './components/FounderDashboard';
import { API_BASE_URL } from './config';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [showFounderDashboard, setShowFounderDashboard] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const t = getTranslation(lang);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'zh' : 'en');

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/corporate-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        alert(result.message);
        setIsLeadModalOpen(false);
      }
    } catch (error) {
      console.error("Lead submission error:", error);
    }
  };

  const handleLogoClick = () => {
    setLogoClicks(prev => {
      if (prev + 1 >= 5) {
        setShowFounderDashboard(true);
        return 0;
      }
      return prev + 1;
    });
    setTimeout(() => setLogoClicks(0), 2000);
  };

  if (showFounderDashboard) {
    return <FounderDashboard />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 glass border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div 
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={handleLogoClick}
            >
              <div className="relative w-10 h-10 bg-brand-teal rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-teal/20">
                S
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-orange rounded-full border-2 border-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">SinoNexus</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-sm font-medium text-slate-600 hover:text-brand-teal transition-colors">Services</a>
              <a href="#assessment" className="text-sm font-medium text-slate-600 hover:text-brand-teal transition-colors">Assessment</a>
              <button 
                onClick={toggleLang}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-sm font-semibold hover:bg-slate-50 transition-all"
              >
                <Globe size={16} />
                {lang === 'en' ? '中文' : 'English'}
              </button>
              <button className="bg-brand-dark text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-black transition-all">
                Client Login
              </button>
            </div>

            <div className="md:hidden flex items-center gap-4">
              <button onClick={toggleLang} className="p-2 text-slate-600">
                <Globe size={20} />
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <a href="#services" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-slate-900">Services</a>
              <a href="#assessment" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-slate-900">Assessment</a>
              <button className="w-full bg-brand-dark text-white py-4 rounded-2xl font-bold">Client Login</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-teal/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-bold uppercase tracking-widest">
                  Powered by aNexus
                </span>
                <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  English / 中文
                </span>
              </div>
              <h1 className="text-5xl sm:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
                {t.heroTitle.split(',').map((part, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <br className="hidden sm:block" />}
                    <span className={i === 1 ? 'text-brand-teal' : ''}>{part}</span>
                  </React.Fragment>
                ))}
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
                {t.heroSub}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#assessment" className="w-full sm:w-auto bg-brand-teal text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-brand-teal/90 transition-all shadow-xl shadow-brand-teal/20 flex items-center justify-center gap-2">
                  {t.checkNow}
                  <ArrowRight size={20} />
                </a>
                <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <img key={i} src={`https://picsum.photos/seed/${i}/40/40`} className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-slate-600">2,500+ Assessments this month</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-start"
              >
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
                  <Users size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{t.individualServices}</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">{t.individualDesc}</p>
                <ul className="space-y-3 mb-10">
                  {['Employment Pass (EP)', 'S Pass & Work Permits', 'Permanent Residency (PR)', 'Student Pass'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <div className="w-1.5 h-1.5 bg-brand-teal rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="mt-auto text-brand-teal font-bold flex items-center gap-2 group">
                  Learn More <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-brand-dark p-10 rounded-[2.5rem] shadow-xl text-white flex flex-col items-start"
              >
                <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-8">
                  <Building2 size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{t.corporateServices}</h3>
                <p className="text-slate-300 mb-8 leading-relaxed">{t.corporateDesc}</p>
                <ul className="space-y-3 mb-10">
                  {['Company Incorporation', 'Corporate Secretarial', 'Accounting & Tax', 'Payroll Management'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-200">
                      <div className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => setIsLeadModalOpen(true)}
                  className="mt-auto text-white font-bold flex items-center gap-2 group"
                >
                  Explore Solutions <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* App Only Section (Replaces Assessment Form) */}
        <section id="assessment" className="py-24 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-white rounded-[3rem] p-12 text-center relative overflow-hidden border border-slate-100 shadow-xl">
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 bg-brand-teal rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-orange rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
              </div>

              <div className="relative z-10">
                <div className="w-20 h-20 bg-brand-teal/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Smartphone className="text-brand-teal" size={40} />
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-6">Eligibility Assessment is App-Only</h2>
                <p className="text-slate-500 text-xl mb-10 max-w-2xl mx-auto">
                  To ensure the highest accuracy and data security, our proprietary probability algorithm is exclusively available on the SinoNexus mobile application.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button className="bg-brand-teal text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-brand-teal/90 transition-all shadow-lg shadow-brand-teal/20 flex items-center gap-2">
                    <Smartphone size={20} />
                    Download Android App
                  </button>
                  <button className="bg-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all flex items-center gap-2">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* App Promo Section */}
        <section className="py-24 bg-brand-dark overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-teal/10 skew-x-12 translate-x-24" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-8 leading-tight">
                  The Full SinoNexus Experience <br />
                  <span className="text-brand-orange">In Your Pocket</span>
                </h2>
                <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                  Our mobile app provides deeper insights, real-time policy updates, and direct access to our expert consultants.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-white text-brand-dark px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-slate-100 transition-all">
                    <Smartphone size={24} />
                    Google Play
                  </button>
                  <div className="relative group">
                    <button className="bg-white/10 text-white/50 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 cursor-not-allowed border border-white/10">
                      <Smartphone size={24} />
                      App Store
                    </button>
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand-orange text-white text-[10px] px-2 py-1 rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity">COMING SOON</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-brand-teal to-teal-900 w-full aspect-square rounded-[3rem] rotate-3 flex items-center justify-center p-8 shadow-2xl">
                  <div className="bg-brand-dark w-full h-full rounded-[2rem] -rotate-3 overflow-hidden border-4 border-white/10 flex flex-col">
                    <div className="h-12 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-500" />
                      <div className="w-2 h-2 rounded-full bg-brand-orange" />
                      <div className="w-2 h-2 rounded-full bg-brand-teal" />
                    </div>
                    <div className="flex-1 p-6 space-y-4">
                      <div className="h-8 w-2/3 bg-white/10 rounded-lg animate-pulse" />
                      <div className="h-32 w-full bg-brand-teal/20 rounded-2xl border border-brand-teal/30 flex items-center justify-center">
                        <span className="text-4xl font-black text-brand-teal">85%</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-white/5 rounded" />
                        <div className="h-4 w-full bg-white/5 rounded" />
                        <div className="h-4 w-3/4 bg-white/5 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 bg-brand-teal rounded-lg flex items-center justify-center text-white font-bold text-lg">
                S
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand-orange rounded-full border border-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">SinoNexus</span>
            </div>
            <div className="flex gap-8 text-sm font-medium">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            </div>
            <p className="text-xs">© 2026 SinoNexus, an aNexus company. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <ChatWidget lang={lang} onTriggerLeadModal={() => setIsLeadModalOpen(true)} />

      {/* Corporate Lead Modal */}
      <AnimatePresence>
        {isLeadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLeadModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 sm:p-10">
                <button 
                  onClick={() => setIsLeadModalOpen(false)}
                  className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={24} />
                </button>
                
                <h2 className="text-3xl font-black text-slate-900 mb-2">{t.corporateLeadTitle} 🚀</h2>
                <p className="text-slate-500 mb-8">{t.corporateLeadSub}</p>

                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t.companyName}</label>
                      <input 
                        type="text" 
                        required 
                        name="companyName"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t.contactName}</label>
                      <input 
                        type="text" 
                        required 
                        name="contactName"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t.email}</label>
                    <input 
                      type="email" 
                      required 
                      name="email"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t.phone}</label>
                    <input 
                      type="tel" 
                      name="phone"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all" 
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-brand-teal text-white py-4 rounded-2xl font-bold text-lg hover:bg-brand-teal/90 transition-all shadow-lg shadow-brand-teal/20 mt-4"
                  >
                    {t.requestCallback}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
