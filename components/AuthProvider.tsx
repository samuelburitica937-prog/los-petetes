'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/auth';

/**
 * AuthProvider — Client Component
 * Inicializa la sesión de Supabase al montar la aplicación.
 * Separado del RootLayout (Server Component) para evitar errores de
 * "hooks en Server Components" en producción con Next.js App Router.
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { initialize } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    return <>{children}</>;
}
