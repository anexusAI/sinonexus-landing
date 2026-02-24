import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Language, AssessmentResult, FormData } from '../types';
import { getTranslation } from '../i18n';
import { API_BASE_URL } from '../config';

interface AssessmentFormProps {
  lang: Language;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({ lang }) => {
  const [formData, setFormData] = useState<FormData>({
    passType: 'EP',
    nationality: '',
    age: '',
    salary: '',
    sector: 'tech',
    education: 'degree',
    universityTier: 'recognized',
    district: 'default',
    yearsInSG: '0',
    familyTies: 'none'
  });
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = getTranslation(lang);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/assess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Assessment error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (result) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-black/5"
      >
        <div className="p-8 sm:p-12 text-center">
          <h2 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">{t.resultTitle}</h2>
          
          <div className="relative inline-block mb-8">
            <div className="text-8xl font-black text-brand-teal">
              {result.probability}<span className="text-4xl font-bold">%</span>
            </div>
            <div className={`mt-4 inline-block px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
              result.tier === 'high' ? 'bg-emerald-100 text-emerald-700' : 
              result.tier === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
            }`}>
              {result.tier} Probability
            </div>
          </div>

          <p className="text-xl font-medium text-slate-800 mb-8 leading-relaxed">
            {result.recommendation}
          </p>

          {result.warnings.length > 0 && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 text-left rounded-r-xl">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2">
                <AlertTriangle size={16} />
                Important Notes
              </div>
              {result.warnings.map((w, i) => (
                <p key={i} className="text-amber-700 text-sm ml-6">• {w}</p>
              ))}
            </div>
          )}

          <p className="text-xs text-slate-400 mb-10 italic">
            {result.disclaimer}
          </p>

          <div className="pt-8 border-t border-slate-100">
            <p className="text-slate-600 mb-6 font-medium">{t.consultation}</p>
            <button className="bg-brand-dark text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg flex items-center gap-2 mx-auto">
              {t.bookConsultation}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 border border-black/5">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-teal rounded-lg flex items-center justify-center text-white">
            <CheckCircle2 size={20} />
          </div>
          {t.formTitle}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">{t.passType}</label>
            <select 
              name="passType" 
              value={formData.passType} 
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all"
            >
              <option value="EP">Employment Pass (EP)</option>
              <option value="S_Pass">S Pass</option>
              <option value="Student">Student's Pass</option>
              <option value="LTVP">LTVP</option>
              <option value="PR">Permanent Residency</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">{t.nationality}</label>
            <input 
              type="text" 
              name="nationality" 
              placeholder="e.g. Chinese, Indian"
              required
              value={formData.nationality}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">{t.age}</label>
            <input 
              type="number" 
              name="age" 
              required
              value={formData.age}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">{t.salary}</label>
            <input 
              type="number" 
              name="salary" 
              required
              value={formData.salary}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">{t.education}</label>
            <select 
              name="education" 
              value={formData.education} 
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all"
            >
              <option value="degree">Bachelor's Degree</option>
              <option value="master">Master's Degree</option>
              <option value="phd">PhD</option>
              <option value="diploma">Diploma</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">{t.sector}</label>
            <select 
              name="sector" 
              value={formData.sector} 
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all"
            >
              <option value="tech">Technology / AI</option>
              <option value="finance">Finance / Banking</option>
              <option value="healthcare">Healthcare</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="sm:col-span-2 pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-brand-teal text-white py-4 rounded-2xl font-bold hover:bg-brand-teal/90 transition-all shadow-lg shadow-brand-teal/20 disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : t.submit}
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-6 flex items-start gap-3 p-4 bg-slate-100 rounded-2xl text-slate-500 text-xs leading-relaxed">
        <Info size={16} className="shrink-0 mt-0.5" />
        SinoNexus uses a proprietary algorithm based on MOM guidelines and community-validated trends. Your data is processed securely and never shared without consent.
      </div>
    </div>
  );
};
