'use client';
import { useState } from 'react';


import { useAuthStore } from '@/lib/auth';
import { CATEGORIES } from '@/lib/data';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState<{
        nombre: string;
        email: string;
        password: string;
        confirmPassword: string;
        esMayorista: boolean;
        selectedCategories: string[];
        selectedPaymentMethods: string[];
    }>({
        nombre: '',
        email: '',
        password: '',
        confirmPassword: '',
        esMayorista: true,
        selectedCategories: [],
        selectedPaymentMethods: ['Bancolombia', 'Nequi'] // Default favorites
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuthStore();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        setLoading(true);
        const success = await register(formData.email, formData.password, formData.nombre, formData.esMayorista, formData.selectedCategories, formData.selectedPaymentMethods);
        if (success) {
            router.push('/');
        }
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-navy flex flex-col pt-32">
            
            <div className="flex-1 flex items-center justify-center p-6 my-12">
                <div className="glass-card p-8 w-full max-w-lg">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl mx-auto mb-4 bg-gradient-yellow text-navy">
                            📝
                        </div>
                        <h1 className="text-4xl font-black mb-2 text-gold uppercase tracking-tighter">Crea tu Cuenta</h1>
                        <p className="text-white/60">Únete a la red mayorista más grande del Eje Cafetero</p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gold uppercase mb-2">Nombre Completo / Empresa</label>
                            <input 
                                type="text" 
                                required 
                                className="input-styled" 
                                placeholder="Ej: Distribuidora Central"
                                onChange={e => setFormData({...formData, nombre: e.target.value})}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gold uppercase mb-2">Correo Electrónico</label>
                            <input 
                                type="email" 
                                required 
                                className="input-styled" 
                                placeholder="contacto@empresa.com"
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gold uppercase mb-2">¿Qué tipo de productos te interesan?</label>
                            <p className="text-white/60 text-xs mb-3">Selecciona los catálogos de tu interés para recibir novedades personalizadas.</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {Object.entries(CATEGORIES).map(([key, cat]) => {
                                    const isSelected = formData.selectedCategories.includes(key);
                                    return (
                                        <label 
                                            key={key} 
                                            className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                                                isSelected 
                                                ? 'bg-gold/20 border-gold/50' 
                                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                            }`}
                                        >
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 accent-gold rounded"
                                                checked={isSelected}
                                                onChange={(e) => {
                                                    const newSelection = e.target.checked 
                                                        ? [...formData.selectedCategories, key]
                                                        : formData.selectedCategories.filter(k => k !== key);
                                                    setFormData({...formData, selectedCategories: newSelection});
                                                }}
                                            />
                                            <span className="text-xs font-medium text-white/90 truncate" title={cat.label}>
                                                {cat.icon} {cat.label}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gold uppercase mb-2">Tus Métodos de Pago Preferidos</label>
                            <p className="text-white/60 text-xs mb-3">Selecciona los métodos de pago que usas. Estos aparecerán en tus cotizaciones y catálogos en PDF.</p>
                            <div className="flex flex-wrap gap-2">
                                {['Bancolombia', 'Nequi', 'Wompi', 'PSE', 'PayPal', 'Payoneer'].map(method => {
                                    const isSelected = formData.selectedPaymentMethods.includes(method);
                                    return (
                                        <button
                                            key={method}
                                            type="button"
                                            onClick={() => {
                                                const current = formData.selectedPaymentMethods;
                                                const next = isSelected ? current.filter(m => m !== method) : [...current, method];
                                                setFormData({...formData, selectedPaymentMethods: next});
                                            }}
                                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${
                                                isSelected
                                                ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                                                : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:border-white/20'
                                            }`}
                                        >
                                            {isSelected ? '✓ ' : ''}{method}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gold uppercase mb-2">Contraseña</label>
                            <input 
                                type="password" 
                                required 
                                className="input-styled" 
                                placeholder="••••••••"
                                onChange={e => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gold uppercase mb-2">Confirmar</label>
                            <input 
                                type="password" 
                                required 
                                className="input-styled" 
                                placeholder="••••••••"
                                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                            />
                        </div>
                        
                        <div className="md:col-span-2 flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                            <input 
                                type="checkbox" 
                                checked={formData.esMayorista}
                                onChange={e => setFormData({...formData, esMayorista: e.target.checked})}
                                className="w-5 h-5 accent-gold"
                            />
                            <label className="text-sm font-medium text-white/80">Deseo registrarme como comprador mayorista para acceder a precios especiales.</label>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="md:col-span-2 btn-primary py-4 text-base font-black uppercase tracking-widest mt-4"
                        >
                            {loading ? 'Creando Cuenta...' : 'Registrarme Ahora'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/10 text-center">
                        <p className="text-white/50 text-sm">
                            ¿Ya tienes cuenta? <Link href="/login" className="text-gold font-bold hover:underline">Inicia Sesión</Link>
                        </p>
                    </div>
                </div>
            </div>
            
        </main>
    );
}
