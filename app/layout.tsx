import type { Metadata, Viewport } from 'next';
import { Archivo } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import AuthProvider from '@/components/AuthProvider';
import { Toaster } from 'react-hot-toast';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-archivo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Los Petetes Mayor | Distribuidora Mayorista Manizales, Armenia, Pereira',
  description:
    'Los Petetes — Distribuidora mayorista en Manizales, Colombia. Ferretería, Belleza, Salud, Hogar, Pet Shop, Deportes, Bebés y más. Envíos a Armenia y Pereira. ¡Los mejores precios al por mayor!',
  keywords: [
    'mayorista Manizales', 'distribuidor mayorista Colombia', 'ferretería mayorista',
    'belleza mayorista', 'pet shop mayorista', 'bebés mayorista', 'Los Petetes',
    'Armenia Caldas', 'Pereira Risaralda', 'compras al por mayor',
  ],
  openGraph: {
    title: 'Los Petetes | Distribuidora Mayorista #1 en el Eje Cafetero',
    description: 'Mayoristas en Manizales con envíos a Armenia y Pereira. Ferretería, Belleza, Salud, Hogar, Sex Shop, Pet Shop, Deportes y Bebés.',
    type: 'website',
    locale: 'es_CO',
    siteName: 'Los Petetes Mayor',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport: Viewport = {
  themeColor: '#001F3F',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="es-CO" className={archivo.variable}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <meta name="geo.region" content="CO-CAL" />
        <meta name="geo.placename" content="Manizales, Caldas, Colombia" />
      </head>
      <body>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 2500,
              style: {
                background: '#002D5E',
                color: '#FFD700',
                border: '1px solid rgba(255,215,0,0.3)',
                fontWeight: 700,
              },
            }}
          />
          <Header />
          <CartSidebar />
          <main>{children}</main>
          <Footer />
          <FloatingWhatsApp />
        </AuthProvider>
      </body>
    </html>
  );
}
