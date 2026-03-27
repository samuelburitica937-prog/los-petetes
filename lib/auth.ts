import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabase';
import { toast } from 'react-hot-toast';

interface User {
    id: string;
    nombre: string;
    email: string;
    esMayorista: boolean;
}

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, pass: string) => Promise<boolean>;
    register: (email: string, pass: string, nombre: string, esMayorista: boolean) => Promise<boolean>;
    logout: () => Promise<void>;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            initialize: async () => {
              const { data: { session } } = await supabase.auth.getSession();
              if (session?.user) {
                  // Fetch profile
                  const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                  set({ 
                      user: {
                          id: session.user.id,
                          email: session.user.email!,
                          nombre: profile?.nombre || session.user.email?.split('@')[0] || 'Usuario',
                          esMayorista: profile?.es_mayorista || false
                      },
                      isAuthenticated: true 
                  });
              }
            },
            login: async (email, pass) => {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
                if (error) {
                    toast.error(error.message);
                    return false;
                }
                if (data.user) {
                    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
                    set({ 
                        user: {
                            id: data.user.id,
                            email: data.user.email!,
                            nombre: profile?.nombre || data.user.email?.split('@')[0] || 'Usuario',
                            esMayorista: profile?.es_mayorista || false
                        },
                        isAuthenticated: true 
                    });
                    toast.success('¡Bienvenido de nuevo!');
                    return true;
                }
                return false;
            },
            register: async (email, pass, nombre, esMayorista) => {
                const { data, error } = await supabase.auth.signUp({ 
                    email, 
                    password: pass,
                    options: {
                        data: { nombre, es_mayorista: esMayorista }
                    }
                });
                if (error) {
                    toast.error(error.message);
                    return false;
                }
                if (data.user) {
                    // Create profile if it doesn't trigger automatically via DB function
                    await supabase.from('profiles').upsert({
                        id: data.user.id,
                        email,
                        nombre,
                        es_mayorista: esMayorista
                    });
                    
                    set({ 
                        user: {
                            id: data.user.id,
                            email,
                            nombre,
                            esMayorista
                        },
                        isAuthenticated: true 
                    });
                    toast.success('¡Cuenta creada con éxito!');
                    return true;
                }
                return false;
            },
            logout: async () => {
                await supabase.auth.signOut();
                set({ user: null, isAuthenticated: false });
                toast.success('Sesión cerrada');
            },
        }),
        { name: 'petetes-auth' }
    )
);
