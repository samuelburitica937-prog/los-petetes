'use client';
import { useState } from 'react';


import { useAuthStore } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuthStore();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const success = await login(email, password);
        if (success) {
            router.push('/');
        }
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-navy flex flex-col pt-32">
            
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="glass-card p-8 w-full max-w-md">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl mx-auto mb-4 bg-gradient-yellow text-navy">
                            👤
                        </div>
                        <h1 className="text-4xl font-black mb-2 text-gold uppercase tracking-tighter">Bienvenido</h1>
                        <p className="text-white/60">Ingresa a tu cuenta de Los Petetes</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gold uppercase mb-2">Correo Electrónico</label>
                            <input 
                                type="email" 
                                required 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="input-styled" 
                                placeholder="tu@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gold uppercase mb-2">Contraseña</label>
                            <input 
                                type="password" 
                                required 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="input-styled" 
                                placeholder="••••••••"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="btn-primary w-full py-4 text-base font-black uppercase tracking-widest"
                        >
                            {loading ? 'Cargando...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/10 text-center space-y-4">
                        <p className="text-white/50 text-sm">
                            ¿No tienes cuenta? <Link href="/registro" className="text-gold font-bold hover:underline">Regístrate ahora</Link>
                        </p>
                    </div>
                </div>
            </div>
            
        </main>
    );
}
