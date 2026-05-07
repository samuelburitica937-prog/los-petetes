import { SEXSHOP_CSV_PRODUCTS } from './sexshop_data';
export type Category = 'aseo' | 'cacharros' | 'vapers' | 'venenos' | 'ferreteria'
  | 'belleza'
  | 'salud'
  | 'hogar'
  | 'sexshop'
  | 'petshop'
  | 'deportes'
  | 'bebes'
  | 'electrodomesticos'
  | 'tecnologia'
  | 'papeleria'
  | 'escolar'
  | 'oficina'
  | 'horaloca'
  | 'jugueteria';

export interface Ally {
  id: string;
  name: string;
  city: string;
  address: string;
  image: string;
  category: string;
}

export function getLevelInfo(totalCOP: number) {
    if (totalCOP >= 20_000_000) return { nivel: 'PLATINO', color: '#E5E4E2', bg: 'from-slate-200/20 to-slate-400/10', border: 'border-slate-200/40', next: null, emoji: '💎', descuento: 0.15 };
    if (totalCOP >= 10_000_000) return { nivel: 'GOLD',    color: '#FFD700', bg: 'from-gold/20 to-amber-600/10',    border: 'border-gold/40',    next: 20_000_000, emoji: '🥇', descuento: 0.10 };
    if (totalCOP >= 5_000_000)  return { nivel: 'SILVER',  color: '#C8C8DC', bg: 'from-slate-300/20 to-slate-400/10',border: 'border-slate-300/40',next: 10_000_000,  emoji: '🥈', descuento: 0.08 };
    if (totalCOP >= 2_000_000)  return { nivel: 'BRONCE',  color: '#CD7F32', bg: 'from-orange-400/20 to-orange-700/10',border:'border-orange-400/40',next: 5_000_000,  emoji: '🥉', descuento: 0.07 };
    return                             { nivel: 'ALIADO',  color: '#4FC3F7', bg: 'from-blue-400/20 to-blue-700/10',border:'border-blue-400/40',next: 2_000_000,  emoji: '🤝', descuento: 0.05 };
}

export interface Campaign {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  category: Category | 'all';
  accent: string;
  image: string;
}

export interface Product {
  id: string;
  nombre: string;
  precio: number;
  precioMayorista: number;
  stock: number;
  categoria: Category;
  imagenes: string[];
  descripcion: string;
  minMayorista: number;
  rating: number;
  vendidos: number;
  tags: string[];
  nuevo?: boolean;
  destacado?: boolean;
}

export const getProductQtyConfig = (product: Product) => {
  return {
    min: 6,
    step: 6
  };
};

export const CATEGORIES: Record<Category, { label: string; icon: string; color: string; desc: string }> = {
  aseo: { label: 'Aseo', icon: '🧹', color: '#00BCD4', desc: 'Productos de aseo' },
  cacharros: { label: 'Cacharros', icon: '📦', color: '#795548', desc: 'Cacharros' },
  vapers: { label: 'Vapers', icon: '💨', color: '#9C27B0', desc: 'Vapers' },
  venenos: { label: 'Venenos', icon: '☠️', color: '#F44336', desc: 'Venenos' },
  ferreteria: { label: 'Ferretería', icon: '🔧', color: '#FF6B35', desc: 'Herramientas, materiales y más' },
  belleza: { label: 'Belleza', icon: '💄', color: '#FF69B4', desc: 'Cosméticos, cuidado personal' },
  salud: { label: 'Salud', icon: '💊', color: '#00C864', desc: 'Vitaminas, medicamentos y bienestar' },
  hogar: { label: 'Hogar', icon: '🏠', color: '#4FC3F7', desc: 'Decoración, limpieza y cocina' },
  sexshop: { label: 'Sex Shop', icon: '❤️', color: '#E91E8C', desc: 'Productos íntimos mayoristas' },
  petshop: { label: 'Pet Shop', icon: '🐾', color: '#8BC34A', desc: 'Mascotas, alimentos y accesorios' },
  deportes: { label: 'Deportes', icon: '⚡', color: '#FF9800', desc: 'Equipos deportivos y fitness' },
  bebes: { label: 'Bebés', icon: '🍼', color: '#FFB6C1', desc: 'Todo para tu bebé' },
  electrodomesticos: { label: 'Electrodomésticos', icon: '⚡', color: '#9C27B0', desc: 'Aparatos para el hogar' },
  tecnologia: { label: 'Tecnología', icon: '📱', color: '#2196F3', desc: 'Gadgets y accesorios tech' },
  papeleria: { label: 'Papelería', icon: '📝', color: '#FFD700', desc: 'Artículos de escritorio y papel' },
  escolar: { label: 'Escolar', icon: '🎒', color: '#4CAF50', desc: 'Todo para el regreso a clases' },
  oficina: { label: 'Oficina', icon: '💼', color: '#607D8B', desc: 'Suministros para empresas' },
  horaloca: { label: 'Hora Loca', icon: '🥳', color: '#F44336', desc: 'Todo para tus eventos y fiestas inolvidables' },
  jugueteria: { label: 'Juguetería', icon: '🧸', color: '#FFC107', desc: 'Diversión para todas las edades con nuestro surtido en tendencia' },
};

const placeholderImages: Record<Category, string[]> = {
  aseo: [''], cacharros: [''], vapers: [''], venenos: [''], ferreteria: [
    'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80',
    'https://images.unsplash.com/photo-1540103359325-3444460718d0?w=400&q=80',
    'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&q=80',
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80',
    'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=400&q=80',
    'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&q=80',
    'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=400&q=80',
    'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400&q=80',
  ],
  belleza: [
    '/images/catalogos/belleza/cropped_Captura de pantalla 2026-03-24 143630.png',
    '/images/catalogos/belleza/cropped_Captura de pantalla 2026-03-24 143654.png',
    '/images/catalogos/belleza/cropped_Captura de pantalla 2026-03-24 143705.png',
    '/images/catalogos/belleza/cropped_Captura de pantalla 2026-03-24 143714.png',
    'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?w=400&q=80',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80',
    'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?w=400&q=80',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80',
  ],
  salud: [
    'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&q=80',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
    'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80',
    'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80',
    'https://images.unsplash.com/photo-1553564552-02656026e8d2?w=400&q=80',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&q=80',
    'https://images.unsplash.com/photo-1576091160550-217359f49af1?w=400&q=80',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80',
    'https://images.unsplash.com/photo-1579165466541-74e2beeac7df?w=400&q=80',
    'https://images.unsplash.com/photo-1583324113626-70df0f43aa2b?w=400&q=80',
  ],
  hogar: [
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
    'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80',
    'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&q=80',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&q=80',
    'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=400&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
  ],
  sexshop: [
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
    'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&q=80',
    'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&q=80',
    'https://images.unsplash.com/photo-1551410224-699683e15636?w=400&q=80',
    'https://images.unsplash.com/photo-1519062322300-88092289658f?w=400&q=80',
    'https://media.istockphoto.com/id/1149514742/es/foto/hermosa-luz-de-las-velas.jpg?s=612x612&w=0&k=20&c=6B9_f5p9X-uO_H-x-vL4a5m4f4p5f4p5f4p5f4p5f4=',
    'https://images.unsplash.com/photo-1578341674068-19702202029c?w=400&q=80',
    'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?w=400&q=80',
  ],
  petshop: [
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&q=80',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
    'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&q=80',
    'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&q=80',
    'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&q=80',
    'https://images.unsplash.com/photo-1591768793355-74d7af236c1f?w=400&q=80',
    'https://images.unsplash.com/photo-1544568100-847a948585b9?w=400&q=80',
    'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=400&q=80',
  ],
  deportes: [
    '/images/catalogos/deportes/cropped_Captura de pantalla 2026-03-24 151548.png',
    '/images/catalogos/deportes/cropped_Captura de pantalla 2026-03-24 151554.png',
    '/images/catalogos/deportes/cropped_Captura de pantalla 2026-03-24 151615.png',
    '/images/catalogos/deportes/cropped_Captura de pantalla 2026-03-24 152636.png',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&q=80',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80',
  ],
  bebes: [
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80',
    'https://images.unsplash.com/photo-1558618047-f4e70bfa6697?w=400&q=80',
    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80',
    'https://images.unsplash.com/photo-1508137359-ddd15df39e3d?w=400&q=80',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=80',
    'https://images.unsplash.com/photo-1544126592-807daf21565c?w=400&q=80',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80',
    'https://images.unsplash.com/photo-1491013516836-74fab8021119?w=400&q=80',
    'https://images.unsplash.com/photo-1510212330277-2e960237582d?w=400&q=80',
    'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=400&q=80',
  ],
  electrodomesticos: [
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',
    'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&q=80',
    'https://images.unsplash.com/photo-1534293507963-f462a79b08d2?w=400&q=80',
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80',
    'https://images.unsplash.com/photo-1571175484658-5bdec61244bc?w=400&q=80',
    'https://images.unsplash.com/photo-1527352723441-448fad6d2963?w=400&q=80',
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&q=80',
  ],
  tecnologia: [
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&q=80',
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80',
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&q=80',
    'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
    'https://images.unsplash.com/photo-1504384308090-c89e12bf9a51?w=400&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80',
    'https://images.unsplash.com/photo-1526733158272-a10ff15816df?w=400&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&q=80',
  ],
  papeleria: [
    '/images/catalogos/papeleria/cropped_Captura de pantalla 2026-03-24 145942.png',
    '/images/catalogos/papeleria/cropped_Captura de pantalla 2026-03-24 145957.png',
    '/images/catalogos/papeleria/cropped_Captura de pantalla 2026-03-24 150018.png',
    '/images/catalogos/papeleria/cropped_Captura de pantalla 2026-03-24 150029.png',
    'https://images.unsplash.com/photo-1583484963846-ad480258479a?w=400&q=80',
    'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=400&q=80',
    'https://images.unsplash.com/photo-1562564055-71e051d33c19?w=400&q=80',
  ],
  escolar: [
    '/images/escolar-premium.png',
    'https://images.unsplash.com/photo-1503945438517-f659ec5ece50?w=400&q=80',
    'https://images.unsplash.com/photo-1544208162-7232490ec723?w=400&q=80',
    'https://images.unsplash.com/photo-1515243306915-d9154a439266?w=400&q=80',
    'https://images.unsplash.com/photo-1413813824599-2a912165cad6?w=400&q=80',
    'https://images.unsplash.com/photo-1584691505413-5484867118ca?w=400&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80',
  ],
  oficina: [
    '/images/oficina-premium.png',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&q=80',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&q=80',
    'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=400&q=80',
    'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=400&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80',
    'https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?w=400&q=80',
  ],
  horaloca: [
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80',
    'https://images.unsplash.com/photo-1530103043960-ef38714abb15?w=400&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80',
    'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400&q=80',
    'https://images.unsplash.com/photo-1472653431158-6364773b2a56?w=400&q=80',
    'https://images.unsplash.com/photo-1514525253344-9ecd994367f0?w=400&q=80',
    'https://images.unsplash.com/photo-1496333036608-dd6a46083097?w=400&q=80',
  ],
  jugueteria: [
    'https://images.unsplash.com/photo-1532330393533-443990a51d10?w=400&q=80',
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&q=80',
    'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&q=80',
    'https://images.unsplash.com/photo-1585366119957-e5733b35984e?w=400&q=80',
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80',
    'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&q=80',
    'https://images.unsplash.com/photo-1533560243451-4191d9061df8?w=400&q=80',
    'https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?w=400&q=80',
    'https://images.unsplash.com/photo-1566576661366-747da9673af3?w=400&q=80',
    'https://images.unsplash.com/photo-1500995617113-cf78800c1bb7?w=400&q=80',
  ],
};

const productTemplates: Record<Category, { nombres: string[]; basePrice: number }> = {
  aseo: { nombres: ['Aseo'], basePrice: 1000 },
  cacharros: { nombres: ['Cacharros'], basePrice: 1000 },
  vapers: { nombres: ['Vapers'], basePrice: 1000 },
  venenos: { nombres: ['Venenos'], basePrice: 1000 },
  ferreteria: {
    nombres: [
      'Taladro Percutor DeWalt 20V', 'Sierra Circular Bosch GKS', 'Martillo Carpintero Stanley', 
      'Destornillador Set x12 Magnetizado', 'Llave Ajustable 12" Pavonada', 'Nivel Aluminio 60cm Magnet', 
      'Cinta Métrica 8m AutoLock', 'Serrucho 22" Profesional', 'Pinza Universal 8" Aislada', 
      'Llave Inglesa 10" HeavyDuty', 'Tornillos Drywall x100 Zinc', 'Puntilla Zinc x500g 1 pulgada', 
      'Pintura Blanca Pintuco 1/4', 'Brocha 4" Cerda Natural', 'Rodillo Lana 18cm Superficies', 
      'Cemento Gris Argos x50kg', 'Arena Lavada x50kg Tamizada', 'Pegante Cerámicas Corona', 
      'Manguera 20m Reforzada', 'Cortadora Cerámica Rubi', 'Amoladora 4.5" Makita', 
      'Soldadora Inversora 160A', 'Guantes Trabajo Cuero Pro', 'Casco Seguridad Tipo II', 
      'Gafas Protección Antiempaño', 'Escalera Aluminio 6 Pasos', 'Cerradura Pomo Schlage', 
      'Candado Hierro 50mm', 'Pala Punta Redonda Herragro', 'Pica con Mango 5lb',
      'Flexómetro 5mts Goma', 'Disco Corte Metal 4.5"', 'Broca Muro Juego x5',
      'Combo Alicates x3 Pro', 'Espátula Acero 4"', 'Nivel de Burbuja 24"',
      'Carretilla 6ft Cúbicos', 'Llana Dentada 12x12', 'Multímetro Digital UT',
      'Linterna LED Recargable'
    ],
    basePrice: 25000,
  },
  belleza: {
    nombres: [
      'Brocha para Rubor Estuche 480', 'Aplicador Torre Cristal 360', 'Brocha Aplicador de Polvo Metalizada', 
      'Brocha Aplicador Metalizada Hueco', 'Brocha Aplicador Metalizada Larga', 'Brocha Aplicador Estampada 1200', 
      'Brocha Aplicador Tipo Sirena Grande', 'Brocha Aplicador Tipo Sirena Mediana', 'Brocha Aplicador Tipo Sirena Pequeña', 
      'Brocha para Tinte 2400', 'Corta Uñas Platino Decorado #4', 'Espejo Doble Cara Carey 18cm', 
      'Lima para Uñas Curva Acolchada', 'Gorro para Cabello Liso Negro', 'Labial Matte Larga Duración',
      'Pestañina Volumen Extremo', 'Set Sombras Nude 24 Colores', 'Base Líquida Hidratante',
      'Corrector Alta Cobertura', 'Iluminador Líquido Golden', 'Polvo Compacto Mineral',
      'Delineador Plumón Negro', 'Fijador de Maquillaje', 'Esponja Mezcladora BeautyBlender',
      'Pinza Cejas Punta Sesgada', 'Esmalte Gel Sin Lámpara', 'Tratamiento Uñas Calcio',
      'Crema Hidratante Facial', 'Sérum Vitamina C 10%', 'Agua Micelar 400ml'
    ],
    basePrice: 15000,
  },
  salud: {
    nombres: [
      'Vitamina C 500mg x60 Tabletas', 'Omega 3 Aceite Pescado x90', 'Multivitamínico Día/Noche x60', 
      'Proteína Whey Isolate 1kg', 'Colágeno Hidrolizado Polvo', 'Zinc 50mg Reforzado x60', 
      'Vitamina D3 1000UI Gotas', 'Probióticos Premium Complex', 'Termómetro Infrarrojo Digital', 
      'Tensiómetro Brazo Automático', 'Glucómetro Accu-Chek Kit', 'Tiras Glucosa x50 Unidades', 
      'Alcohol Etílico 96% 1L', 'Agua Oxigenada Curativa 1L', 'Algodón Quirúrgico 100g', 
      'Gasas Estériles Bolsa x10', 'Vendas Algodón Elásticas x3', 'Tapabocas N95 Certificado x20', 
      'Guantes Látex Talla M x100', 'Ibuprofeno 400mg x10 Caps', 'Jarabe para Tos Natural', 
      'Suero Oral Hidratante x12', 'Curitas Variadas Caja x50', 'Gel Antibacterial 500ml', 
      'Complejo B Inyectable Ampolla', 'Gafas de Lectura +1.50', 'Plantillas Ortopédicas Gel', 
      'Rodillera Elástica Soporte', 'Tobillera Ajustable Neopreno', 'Faja Postquirúrgica Unisex'
    ],
    basePrice: 8000,
  },
  hogar: {
    nombres: [
      'Juego Ollas Acero Inoxidable x5', 'Sartén Antiadherente Tefal 24cm', 'Exprimidor Naranjas Eléctrico', 
      'Licuadora Samurai 2L 5 Vel', 'Abrelatas Eléctrico Automático', 'Escurridor Platos Cromado', 
      'Tabla Cortar Bambu Antibacterial', 'Set Cubiertos Premium x24', 'Platos Porcelana Blanca x6', 
      'Vasos Vidrio Cristal x6', 'Colcha Matrimonial King Soft', 'Almohadas Memo Foam x2', 
      'Cojín Decorativo Terciopelo', 'Cortinas Blackout Lino', 'Toallas Baño Algodón x3', 
      'Porta Escoba Organizador', 'Balde Plástico Heavy 20L', 'Trapeador Giratorio 360', 
      'Escoba y Recogedor EasyClean', 'Jabón Loza biodegradable 1kg', 'Organizador Zapatos 10 Niveles', 
      'Lámpara de Noche Táctil LED', 'Espejo Cuerpo Completo 1.5m', 'Cuadro Decorativo Óleo', 
      'Reloj de Pared Minimalista', 'Portacomidas Térmico 3 Niveles', 'Molde Repostería Silicona', 
      'Jarra Vidrio Borosilicato 2L', 'Set Contenedores Herméticos x10', 'Alfombra Salón Pelo Corto'
    ],
    basePrice: 20000,
  },
  sexshop: {
    nombres: [
      'Lubricante Base Agua 100ml', 'Aceite Masajes Frutos Rojos', 'Perfume Feromonas Man', 
      'Gel Retardante Power', 'Crema Excitante Climax', 'Preservativos Texturizados x12', 
      'Dados Eroticos Brillan Oscuridad', 'Velas Aromáticas Sensuales', 'Antifaz Satín Negro', 
      'Set Cosquillas Plumas', 'Anillo Vibrador CockRing', 'Bala Vibradora MultiVel', 
      'Pluma Sensorial Tentación', 'Lencería Encaje Babydoll', 'Esposas Metal Recubiertas', 
      'Bomba de Vacío Manual', 'Gel de Calor Chocolate', 'Kit Erótico Viaje Privé', 
      'Látigo Soft Cuero Sintético', 'Pezoneras Decorativas Corazón', 'Limpiador Juguetes Spray', 
      'Esencia Relajante Eucalipto', 'Mascarilla de Seda Premium', 'Juego de Cartas Kamasutra', 
      'Tantra Oil Luxury', 'Espuma de Baño Burbujas', 'Body Paint Chocofresa', 
      'Vela de Masaje Soja', 'Tanga Hilo Dental Encaje', 'Arnés Ajustable Táctico'
    ],
    basePrice: 18000,
  },
  petshop: {
    nombres: [
      'Croquetas Perro Adulto 10kg', 'Croquetas Gato Estirilizado 5kg', 'Snacks Perro Pollo x50', 
      'Collar Ajustable Reflectante', 'Correa Retráctil 5m Flexi', 'Cama Perro Talla L Ortopédica', 
      'Jaula Pájaros Tropical', 'Arenero Gato Cerrado', 'Arena Silicona 5L Sin Olor', 
      'Champú Perro Pelaje Blanco 500ml', 'Cepillo Pelo Perro Doble Faz', 'Juguete Kong Classic M', 
      'Plato Doble Acero Inox', 'Bebedero Automático 2L Fuente', 'Ropa Perro Saco Lana M', 
      'Antiparasitario Bravecto x3', 'Transportadora Gato Viaje Web', 'Rascador Gato 3 Niveles', 
      'Golosinas Gato Atún x30', 'Cortauñas Mascota Pro', 'Snacks de Higado Deshidratado', 
      'Juguete Pluma Gato Laser', 'Pretal Entrenamiento No-Pull', 'Bozal Seguridad Ajustable', 
      'Loción Perro Talco 120ml', 'Baño en Seco Espuma', 'Eliminador Olores Mascotas', 
      'Pala Arena Gato Ergonómica', 'Hueso Calcio Gigante', 'Vitaminas Caninas Articulación'
    ],
    basePrice: 12000,
  },
  deportes: {
    nombres: [
      'Balón Baloncesto Spalding TF', 'Balón Voleibol Mikasa Neón', 'Raqueta Ping Pong Stiga + 3Pelotas', 
      'Gafa Natación Speedo Silicona', 'Banda Elastica Resistencia x3', 'Paleta Taekwondo Doble Contacto', 
      'Pechera Taekwondo Protec #2', 'Mesa de Ping Pong Plegable', 'Set de Pesas 20kg Maletín',
      'Lazo Saltas Velocidad Pro', 'Mat de Yoga 6mm Antideslizante', 'Botella Agua Deportiva 1L',
      'Camiseta Running Transpirable', 'Guantes Boxeo Training 12oz', 'Casco Ciclismo Ajustable',
      'Rodillo Entrenamiento Bicicleta', 'Cronómetro Digital Arbitraje', 'Conos Entrenamiento x10',
      'Silbato Metal Fox 40', 'Maletín Deportivo Impermeable'
    ],
    basePrice: 35000,
  },
  bebes: {
    nombres: [
      'Pañales Huggies T2 x60', 'Pañales Pampers T3 x56', 'Toallitas Húmedas Jhonsons x80', 
      'Biberón Avent Anticólico', 'Chupo Silicona Nuk Etapa 1', 'Crema Pañalitis Desitin 100g', 
      'Shampoo Bebé Jhonsons 400ml', 'Talco Bebé Clásico 200g', 'Muda Ropa Algodón Neonato', 
      'Medias Antideslizantes Animales', 'Cobertor Bebé Térmico Peluche', 'Coche Bastón Plegable', 
      'Silla Carro Certificada 0-4 años', 'Cuna Portátil Corralito', 'Mecedora Eléctrica Graco', 
      'Andador Musical Activity', 'Jumper Brincos Fisher-Price', 'Juguetes Mordedor Silicona', 
      'Intercomunicador Digital Audio', 'Termómetro Bebé Punta Flexible', 'Extractor Leche Manual Medela', 
      'Bolsas Almacenamiento Leche x25', 'Esterilizador Biberón Microondas', 'Tetero Cuchara Papillas', 
      'Plato Ventosa Silicona', 'Babero Silicona Bolsillo', 'Set Cuidado Baño Kit x7', 
      'Aspirador Nasal Bebé', 'Cortauñas Bebé Seguridad', 'Cepillo Dental Silicona Dedal'
    ],
    basePrice: 22000,
  },
  electrodomesticos: {
    nombres: [
      'Nevera Haceb 320L No Frost', 'Lavadora Samsung 18kg Carga Sup', 'Televisor LG LED 42" 4K', 
      'Microondas Whirlpool 30L', 'Aire Acondicionado 12000 BTU Inverter', 'Estufa Mabe 4P Gas con Horno', 
      'Calentador Eléctrico Pared', 'Aspiradora Ciclónica Electrolux', 'Plancha Vapor Black+Decker', 
      'Ventilador Torre Digital Silencioso', 'Horno Eléctrico 42L Rostizado', 'Purificador Agua Ozono', 
      'Sanduchera 2 Panes Antiadherente', 'Waflera Redonda Giratoria', 'Batidora Mano 5 Vel Hamilton', 
      'Cafetera Goteo 12 Tazas Black', 'Freidora Aire 4L Digital Oster', 'Hervidor Agua 1.7L Inox', 
      'Tostadora 2 Rebanadas Extra Ancha', 'Plancha Asadora Eléctrica Fam', 'Minibar Whirlpool 90L', 
      'Campana Extractora 60cm Inox', 'Licuadora Inmersión 3 en 1', 'Picatodo Eléctrico 1.5L', 
      'Crepera Antiadherente 30cm', 'Máquina Palomitas Aire Caliente', 'Molinillo Café Automático', 
      'Plancha Ropa Seca Clásica', 'Radiador Aceite 7 Celdas', 'Secador Manos Automático'
    ],
    basePrice: 350000,
  },
  tecnologia: {
    nombres: [
      'Cable USB-C 2m Reforzado', 'Audífonos Bluetooth In-Ear Pro', 'Parlante Bluetooth JBL Flip', 
      'Power Bank 20000mAh Xiaomi', 'Memoria USB 64GB Kingston', 'Soporte Celular Magnético Auto', 
      'Forro Celular Silicona Transp', 'Protector Pantalla Cristal x5', 'Cargador Rápido GaN 65W', 
      'Hub USB-C 7 puertos Aluminio', 'Mouse Inalámbrico Ergonómico Logitech', 'Teclado Bluetooth Recargable Slim', 
      'Webcam HD 1080p Micrófono', 'Micrófono USB Podcast Pro', 'Ring Light 26cm Trípode', 
      'Adaptador HDMI a VGA', 'Reloj Inteligente Smartwatch Sport', 'Control Gamer PC/PS4 Dual', 
      'Limpiador Pantallas Gel Kit', 'Repetidor WiFi AC1200 TP-Link', 'Base Refrigerante Gamers LED', 
      'Organizador Cables Velcro x10', 'Bolso Maletín Portátil 15"', 'Tableta Dibujo Huion H610', 
      'Lápiz Óptico Capacitivo', 'Lector Memoria Micro SD USB', 'Mini Teclado Inalámbrico TV', 
      'Trípode Celular Flexible', 'Selfie Stick Bluetooth Ext', 'Audífonos Gamer 7.1 Surround'
    ],
    basePrice: 28000,
  },
  papeleria: {
    nombres: [
      'Ábaco Cerrado Madera x72', 'Abaco Cerrado Plastico Multicolor', 'Tabla Apoyo Acrilica Oficio', 
      'Repuesto Mina 2.0mm 2B Estuche', 'Rollo Precio Neon Pack x10', 'Set Escuadras 22cm + Transportador', 
      'Set Crayolas y Acuarelas Pro', 'Bloc Notas Adhesivas Colores', 'Marcadores Permanentes x12',
      'Cinta Adhesiva Transparente Pro', 'Grapadora Metálica 20 Hojas', 'Clips Metálicos Caja x100',
      'Perforadora 2 Huecos Pro', 'Pegante en Barra 40g Magic', 'Resaltadores Pastel x6',
      'Bolígrafos Gel Punta Fina x10', 'Tijeras Oficina Acero Inox', 'Calculadora 12 Dígitos Solar',
      'Organizador Escritorio Metal', 'Borrador Pan de Goma Caja'
    ],
    basePrice: 5000,
  },
  escolar: {
    nombres: [
      'Maleta Totto Ergonómica L', 'Lonchera Térmica Impermeable', 'Cartuchera Triple Sew', 
      'Set Reglas Geometría Flex', 'Compás Precision Maped', 'Borrador Nata Pelikan Blanco', 
      'Sacapuntas Doble Depósito Metal', 'Témperas Escolares x12 Frascos', 'Pinceles Artísticos Set x12', 
      'Plastilina Barra Grande x10', 'Block Dibujo Durex A3', 'Lápices Dibujo HB Faber-Castell', 
      'Carpeta Escolar Plástica A4', 'Kit Pintura Dedo Bebé Seguro', 'Delantal Plástico Escolar', 
      'Acuarelas Kit x24 Colores', 'Papel Colores Varios x100 Hojas', 'Pegante Blanco 500g Pega', 
      'Diccionario Larousse Ilustrado', 'Libro Colorear Mandalas Niños', 'Flashcards Abecedario Didáctico', 
      'Abaco Madera 10 Líneas', 'Puzzle Educativo Mapa Mundi', 'Kit Experimentos Química Junior', 
      'Flauta Dulce Yamaha Beige', 'Silicona Líquida 250ml Frasco', 'Foamy Colores Pack Pliegos', 
      'Escarcha Tubo Pack x12', 'Ojos Locos Mobibles Pack', 'Lentejuelas Colores Surtidos'
    ],
    basePrice: 12000,
  },
  oficina: {
    nombres: [
      'Grapadora Industrial HeavyDuty', 'Calculadora Casio Científica Plus', 'Organizador Escritorio Giratorio', 
      'Cinta Pegante Embalaje 100m', 'Clips Mariposa Jumbo Caja', 'Sobre Manila Oficio x100 Und', 
      'Marcadores Borrables Expo x4', 'Sello Automático Personalizado', 'Papel Carbón Azul x100 Hojas', 
      'Libretas Contables 3 Columnas', 'Mueble Archivero 3 Gavetas', 'Destructora Papel Corte Cruzado', 
      'Silla Oficina Ergonómica Malla', 'Pizarra Blanca 90x60 Magnet', 'Reposapiés Ajustable Oficina', 
      'Soporte Monitor Altura Regulable', 'Mousepad Gel Descansamuñecas', 'Lámpara Escritorio Arquitecto', 
      'Caja Fuerte Pequeña Digital', 'Contadora Billetes UV/MG Bill', 'Detector Billetes Falsos Linterna', 
      'Portacarnet Cinta Retráctil x10', 'Tablero Corcho Marco Madera', 'Chinches Colores Cabeza Redonda', 
      'Gomas Elásticas Pack 500g', 'Separadores Carpeta 10 Pestañas', 'Índices Adhesivos Flecha Post', 
      'Sobres Blancos x100 Oficio', 'Etiquetas Precios Autoadhesivas', 'Etiquetadora Manual 1 Línea'
    ],
    basePrice: 15000,
  },
  horaloca: {
    nombres: [
      'Gafas Neon Variadas Pack x10', 'Sombreros Carnaval Escarcha', 'Collares Hawaianos Seda Pack', 
      'Antifaces Misterio Encaje Lujo', 'Pitos y Cornetas Fiesta Pack', 'Espuma Carnaval Extra Niebla', 
      'Confeti Metalizado Cañón 50cm', 'Globos R12 Cromados x50', 'Diademas Temáticas Party', 
      'Pulseras Luminosas Tubo x100', 'Tanque Helio Portátil Lite', 'Bomba Manual Globos Doble Acción', 
      'Cortinas Metalizadas 2m x 1m', 'Letreros "Feliz Cumple" Metálicos', 'Velas Volcán Pastelería x4', 
      'Serpentina Spray Colores Fast', 'Antorchas Humo Color Fest', 'Kits Temáticos Pirata Niños', 
      'Maquillaje Neón BodyPaint', 'Capa Superhéroe Satín Larga', 'Peluca Afro Colores Jumbo', 
      'Nariz Payaso Espuma Profesional', 'Varitas Hada Luz LED Magic', 'Espadas Inflables Guerrero Pack', 
      'Sombrero Loco Goma Eva Gigante', 'Medias Rayas Carnaval Altas', 'Guantes Luces LED Dedos', 
      'Proyector Luces Disco Giratorio', 'Máquina Burbujas Portátil Pro', 'Pistolas Agua Party Squirter'
    ],
    basePrice: 8000,
  },
  jugueteria: {
    nombres: [
      'Set Bloques Construcción 500p', 'Muñeca Articulada Fashion', 'Carro Control Remoto 4x4', 
      'Rompecabezas 1000 piezas Paisaje', 'Cocina de Juguete Integral', 'Pista Carreras Loop Doble', 
      'Juego de Te Porcelana Kids', 'Dinosaurios Colección T-Rex', 'Walkie Talkies Largo Alcance', 
      'Kit Doctor Maletín Médico', 'Patines Ajustables Talla 30-34', 'Monopatin Aluminio Plegable', 
      'Balón Messi Edición Especial', 'Set Pintura Artística Kids', 'Masas Modelar Play-Set', 
      'Microscopio Escolar Pro', 'Telescopio Astronomía Inicial', 'Drone Cámara HD Plegable', 
      'Teclado Musical 61 Teclas', 'Guitarra Madera Niños', 'Set Peluquería Canina Juguete', 
      'Granja de Animales Sonidos', 'Lanza Dardos Suaves Air', 'Arco y Flecha con Ventosa', 
      'Casa de Muñecas 3 Pisos', 'Robot Inteligente Interactiva', 'Caja de Herramientas Master', 
      'Cámara Instantánea Kids', 'Burbujero Gigante Eléctrico', 'Ajedrez Madera Profesional'
    ],
    basePrice: 28000,
  },
};

// Seeded pseudo-random for deterministic data (fixes hydration mismatch)
function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateProducts(): Product[] {
  const products: Product[] = [];
  let idCounter = 1;
  const rand = seededRand(42);

  Object.entries(productTemplates).forEach(([cat, data]) => {
    const category = cat as Category;
    const imgs = placeholderImages[category];

    if (!imgs || imgs.length === 0) return;

    data.nombres.forEach((nombre, idx) => {
      const baseP = data.basePrice;
      const variation = 0.7 + rand() * 0.8;
      const precio = Math.round(baseP * variation * 100) / 100;

      // Add 2 variations per base name
      for (let v = 0; v < 2; v++) {
        const vPrecio = Math.round(precio * (1 + v * 0.15));
        const stockVal = Math.floor(rand() * 200) + 5;
        const minOptions: number[] = [6, 12, 24, 48, 100];
        const minIdx = Math.floor(rand() * minOptions.length);

        // Pick 4 images with unique offsets to avoid obvious repetition
        const mainImgIdx = (idx * 2 + v) % imgs.length;
        const prodImages = [
          imgs[mainImgIdx],
          imgs[(mainImgIdx + 1) % imgs.length],
          imgs[(mainImgIdx + 2) % imgs.length],
          imgs[(mainImgIdx + 3) % imgs.length],
        ];

        products.push({
          id: `${category}-${idCounter++}`,
          nombre: v === 0 ? nombre : `${nombre} ${['Premium', 'Pro'][v - 1] || ''}`.trim(),
          precio: vPrecio,
          precioMayorista: Math.round(vPrecio * 0.65),
          stock: stockVal,
          categoria: category,
          imagenes: prodImages,
          descripcion: `${nombre} de alta calidad para distribución mayorista. Un artículo fundamental para el catálogo de cualquier negocio en el Eje Cafetero. Garantía de durabilidad y excelente margen de utilidad.`,
          minMayorista: minOptions[minIdx],
          rating: +(3.5 + rand() * 1.5).toFixed(1),
          vendidos: Math.floor(rand() * 1000),
          tags: [category, nombre.toLowerCase().split(' ')[0]],
          nuevo: rand() > 0.85,
          destacado: rand() > 0.8,
        });
      }
    });
  });

  return products;
}

import { IMPORTED_PRODUCTS } from './imported_data';

export const ALL_PRODUCTS: Product[] = [
    ...IMPORTED_PRODUCTS,
  ...SEXSHOP_CSV_PRODUCTS
].map((p, i) => ({
  ...p,
  minMayorista: 6,
  stock: p.stock === 100 ? (12 + (i % 89)) : p.stock,
  destacado: (i % 30 === 0), // Aproximadamente 1 de cada 30 productos es destacado
  nuevo: false // Quitar etiqueta de nuevo por ahora
}));

export const FEATURED_PRODUCTS = ALL_PRODUCTS.filter(p => p.destacado).slice(0, 19);

export const getProductsByCategory = (cat: Category | 'all') =>
  cat === 'all' ? ALL_PRODUCTS : ALL_PRODUCTS.filter(p => p.categoria === cat);

export const formatPrice = (price: number): string =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

export const HERO_SLIDES = [
  {
    id: 1,
    title: 'Liquidaciones de Última Hora',
    subtitle: 'Precios de remate en más de 200 referencias. Solo hasta agotar existencias.',
    tag: '⚡ Oferta Flash',
    cta: 'Aprovechar Ahora',
    category: 'all',
    accent: '#FF0000',
  },
  {
    id: 2,
    title: 'Top Ventas en el Eje Cafetero',
    subtitle: 'Los productos más solicitados por nuestros aliados en Manizales, Pereira y Armenia.',
    tag: '🏆 Más Vendidos',
    cta: 'Ver Favoritos',
    category: 'all',
    accent: '#FFD700',
  },
  {
    id: 3,
    title: 'Línea de Belleza Profesional',
    subtitle: 'Surtido completo para salones y tiendas especializadas. Precios de fábrica.',
    tag: '💄 Belleza',
    cta: 'Ver Catálogo',
    category: 'belleza',
    accent: '#E91E63',
  },
  {
    id: 4,
    title: 'Suministros de Oficina y Papelería',
    subtitle: 'Todo lo que tu negocio necesita para operar, en un solo lugar.',
    tag: '💼 Oficina',
    cta: 'Surtir Mi Negocio',
    category: 'oficina',
    accent: '#2196F3',
  },
];

export const CITIES = [
  { name: 'Manizales', emoji: '🏙️', desc: 'Sede principal', mapUrl: 'https://maps.google.com/?q=Manizales,Caldas,Colombia', lat: 5.0703, lng: -75.5138 },
  { name: 'Pereira', emoji: '🌆', desc: 'Zona Cafetera', mapUrl: 'https://maps.google.com/?q=Pereira,Risaralda,Colombia', lat: 4.8143, lng: -75.6946 },
  { name: 'Armenia', emoji: '🌿', desc: 'Quindío', mapUrl: 'https://maps.google.com/?q=Armenia,Quindio,Colombia', lat: 4.5335, lng: -75.6811 },
];

export const CAMPAIGNS: Record<number, Campaign> = {
  0: { // Jan
    id: 'escolar',
    title: 'Temporada Escolar',
    subtitle: 'Todo para el regreso a clases de tus clientes.',
    tag: '📚 Escolar 2026',
    category: 'escolar',
    accent: '#4CAF50',
    image: 'https://images.unsplash.com/photo-1503945438517-f659ec5ece50?w=800&q=80'
  },
  1: { // Feb
    id: 'escolar_final',
    title: 'Remate Escolar',
    subtitle: 'Últimas unidades en útiles y morrales.',
    tag: '🎒 Última Hora',
    category: 'escolar',
    accent: '#FF9800',
    image: 'https://images.unsplash.com/photo-1544208162-7232490ec723?w=800&q=80'
  },
  2: { // Mar
    id: 'mujer',
    title: 'Mes de la Mujer',
    subtitle: 'Detalles y belleza para celebrar a lo grande.',
    tag: '💄 Especial Marzo',
    category: 'belleza',
    accent: '#E91E63',
    image: '/images/catalogos/belleza/cropped_Captura de pantalla 2026-03-24 143654.png'
  },
  3: { // Apr
    id: 'ninos',
    title: 'Mes de la Niñez',
    subtitle: 'Juguetes y sorpresas para los más pequeños.',
    tag: '🎈 Día del Niño',
    category: 'bebes',
    accent: '#2196F3',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80'
  },
  4: { // May
    id: 'madres',
    title: 'Temporada de Madres',
    subtitle: 'El mejor surtido para el regalo de mamá.',
    tag: '🌸 Mayo Especial',
    category: 'belleza',
    accent: '#FF69B4',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80'
  },
  5: { // Jun
    id: 'padres',
    title: 'Temporada de Padres',
    subtitle: 'Herramientas y tecnología para papá.',
    tag: '🔧 Junio Pro',
    category: 'ferreteria',
    accent: '#607D8B',
    image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=80'
  },
  6: { // Jul
    id: 'vacaciones',
    title: 'Vacaciones de Mitad Año',
    subtitle: 'Deportes y aire libre para la temporada.',
    tag: '☀️ Sol y Playa',
    category: 'deportes',
    accent: '#FFC107',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80'
  },
  7: { // Aug
    id: 'cometas',
    title: 'Mes de las Cometas',
    subtitle: 'Artículos de temporada y diversión al aire libre.',
    tag: '🪁 Agosto Vuela',
    category: 'deportes',
    accent: '#03A9F4',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80'
  },
  8: { // Sep
    id: 'amor',
    title: 'Amor y Amistad',
    subtitle: 'Regalos corporativos y detalles especiales.',
    tag: '❤️ Septiembre',
    category: 'hogar',
    accent: '#F44336',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80'
  },
  9: { // Oct
    id: 'halloween',
    title: 'Temporada Halloween',
    subtitle: 'Todo en hora loca, disfraces y dulces.',
    tag: '🎃 Octubre Miedo',
    category: 'horaloca',
    accent: '#FF9800',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80'
  },
  10: { // Nov
    id: 'black',
    title: 'Pre-Navidad & Black',
    subtitle: 'Los descuentos más grandes del año.',
    tag: '🏁 Black Friday',
    category: 'tecnologia',
    accent: '#000000',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80'
  },
  11: { // Dec
    id: 'navidad',
    title: 'Gran Gala Navideña',
    subtitle: 'Línea de juguetes y hogar para fin de año.',
    tag: '🎄 Feliz Navidad',
    category: 'hogar',
    accent: '#2E7D32',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80'
  },
};

export const ALLIES: Ally[] = [
  { 
    id: '1', 
    name: 'Ferretería La 22', 
    city: 'Manizales', 
    address: 'Calle 22 #19-45', 
    image: 'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=800&q=80',
    category: 'Ferretería'
  },
  { 
    id: '2', 
    name: 'Distribuidora El Éxito', 
    city: 'Pereira', 
    address: 'Carrera 7 #15-30', 
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    category: 'Deportes'
  },
  { 
    id: '3', 
    name: 'Variedades El Parque', 
    city: 'Armenia', 
    address: 'Calle 10 #12-11', 
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
    category: 'Hogar'
  },
  { 
    id: '4', 
    name: 'Salud y Vida Central', 
    city: 'Manizales', 
    address: 'Carrera 23 #54-10', 
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&q=80',
    category: 'Salud'
  },
  { 
    id: '5', 
    name: 'Papelería El Lápiz', 
    city: 'Pereira', 
    address: 'Calle 18 #9-44', 
    image: '/images/papeleria-premium.png',
    category: 'Papelería'
  },
  { 
    id: '6', 
    name: 'Mascotas Felices', 
    city: 'Armenia', 
    address: 'Avenida Centenario #14-05', 
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
    category: 'Pet Shop'
  }
];

export const getCurrentCampaign = (): Campaign => {
  const month = new Date().getMonth();
  return CAMPAIGNS[month] || CAMPAIGNS[11];
};
