'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        confirmPassword: '',
        esMayorista: true
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
        const success = await register(formData.email, formData.password, formData.nombre, formData.esMayorista);
        if (success) {
            router.push('/');
        }
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-navy flex flex-col pt-32">
            <Header />
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
            <Footer />
        </main>
    );
}
