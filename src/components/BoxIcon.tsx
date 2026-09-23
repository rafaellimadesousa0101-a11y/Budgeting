import React from 'react';
import {
  Plane,
  Home,
  Umbrella,
  Palmtree,
  Car,
  Plus,
  HeartPulse,
  Cross,
  Hammer,
  Paintbrush,
  GraduationCap,
  Laptop,
  Smartphone,
  Heart,
  ShieldCheck,
  TrendingUp,
  Gift,
  ShoppingBag,
  PiggyBank,
  Wrench,
  Baby,
  Sparkles,
} from 'lucide-react';

interface BoxIconProps {
  icon: string;
  className?: string;
}

// Clean inline SVG for Motorcycle (matching Lucide 2px stroke style)
export const MotorcycleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Wheels */}
    <circle cx="5" cy="17" r="3" />
    <circle cx="19" cy="17" r="3" />
    {/* Chassis & Fork */}
    <path d="M5 17h4l4-6h4l2 3h-4" />
    <path d="M15 7l-2 4" />
    <path d="M13 7h4" />
    {/* Handlebar */}
    <circle cx="17" cy="6" r="0.5" />
    <path d="M12 11l-3 6" />
    {/* Seat */}
    <path d="M9 13h3" />
  </svg>
);

// Clean inline SVG for Medical Cross (+)
export const MedicalCrossIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 5v14M5 12h14" />
    <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth="2" />
  </svg>
);

export const BoxIcon: React.FC<BoxIconProps> = ({ icon, className = 'w-5 h-5' }) => {
  switch (icon) {
    case 'Plane':
    case 'viagem':
      return <Plane className={className} />;
    case 'Home':
    case 'casa':
      return <Home className={className} />;
    case 'Umbrella':
    case 'Palmtree':
    case 'ferias':
      return <Palmtree className={className} />;
    case 'Motorcycle':
    case 'moto':
      return <MotorcycleIcon className={className} />;
    case 'Car':
    case 'carro':
      return <Car className={className} />;
    case 'Plus':
    case 'Cross':
    case 'saude':
      return <MedicalCrossIcon className={className} />;
    case 'Hammer':
    case 'construcao':
    case 'obra':
    case 'reforma':
      return <Hammer className={className} />;
    case 'Paintbrush':
    case 'pintura':
      return <Paintbrush className={className} />;
    case 'GraduationCap':
    case 'educacao':
      return <GraduationCap className={className} />;
    case 'Laptop':
    case 'tech':
      return <Laptop className={className} />;
    case 'Smartphone':
    case 'celular':
      return <Smartphone className={className} />;
    case 'Heart':
    case 'casamento':
      return <Heart className={className} />;
    case 'ShieldCheck':
    case 'reserva':
      return <ShieldCheck className={className} />;
    case 'TrendingUp':
    case 'investimento':
      return <TrendingUp className={className} />;
    case 'Gift':
    case 'presente':
      return <Gift className={className} />;
    case 'ShoppingBag':
    case 'compras':
      return <ShoppingBag className={className} />;
    case 'Baby':
    case 'filho':
      return <Baby className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    default:
      return <PiggyBank className={className} />;
  }
};

/**
 * Helper to detect icon based on keywords in custom category name or description
 */
export function detectIconFromText(text: string): { icon: string; matchedLabel: string } {
  const normalized = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (/viagem|voo|passagem|turismo|aviao|exterior|aeroporto|viajar|eurotrip|passaporte/.test(normalized)) {
    return { icon: 'Plane', matchedLabel: 'Viagem' };
  }
  if (/casa|apartamento|imovel|moradia|terreno|aluguel|lar|condominio|escritura/.test(normalized)) {
    return { icon: 'Home', matchedLabel: 'Casa' };
  }
  if (/feria|praia|verao|resort|descanso|cruzeiro|pousada|mar/.test(normalized)) {
    return { icon: 'Palmtree', matchedLabel: 'Férias' };
  }
  if (/moto|motocicleta|scooter|duas rodas|honda|yamaha|capacete|cg/.test(normalized)) {
    return { icon: 'Motorcycle', matchedLabel: 'Moto' };
  }
  if (/carro|veiculo|automovel|auto|cnh|ipva|gasolina|pneu|mecanico/.test(normalized)) {
    return { icon: 'Car', matchedLabel: 'Carro' };
  }
  if (/saude|medico|hospital|remedio|farmacia|exame|dentista|cirurgia|terapia|plano de saude/.test(normalized)) {
    return { icon: 'Plus', matchedLabel: 'Saúde' };
  }
  if (/construcao|reforma|obra|tijolo|cimento|pedreiro|pedra|azulejo|piso|encanador/.test(normalized)) {
    return { icon: 'Hammer', matchedLabel: 'Construção/Reforma' };
  }
  if (/pintura|tinta|verniz|pintar|parede/.test(normalized)) {
    return { icon: 'Paintbrush', matchedLabel: 'Pintura' };
  }
  if (/educacao|curso|faculdade|estudo|escola|pos|mestrado|livro|aula|idioma|ingles/.test(normalized)) {
    return { icon: 'GraduationCap', matchedLabel: 'Educação' };
  }
  if (/computador|notebook|pc|gamer|eletronico|setup|hardware|teclado/.test(normalized)) {
    return { icon: 'Laptop', matchedLabel: 'Tecnologia' };
  }
  if (/celular|smartphone|iphone|samsung|xiaomi|mobile/.test(normalized)) {
    return { icon: 'Smartphone', matchedLabel: 'Celular' };
  }
  if (/casamento|alianca|noivado|festa|bodas/.test(normalized)) {
    return { icon: 'Heart', matchedLabel: 'Casamento' };
  }
  if (/reserva|emergencia|seguranca|imprevisto|colchao/.test(normalized)) {
    return { icon: 'ShieldCheck', matchedLabel: 'Reserva de Emergência' };
  }
  if (/investimento|acao|cripto|renda|futuro|fundos|dividendos/.test(normalized)) {
    return { icon: 'TrendingUp', matchedLabel: 'Investimentos' };
  }
  if (/presente|aniversario|natal|lembranca/.test(normalized)) {
    return { icon: 'Gift', matchedLabel: 'Presentes' };
  }
  if (/roupa|moda|shopping|compra|acessorio|vestuario/.test(normalized)) {
    return { icon: 'ShoppingBag', matchedLabel: 'Compras' };
  }
  if (/filho|bebe|crianca|parto|maternidade|enxoval/.test(normalized)) {
    return { icon: 'Baby', matchedLabel: 'Filhos/Família' };
  }

  return { icon: 'PiggyBank', matchedLabel: 'Caixinha Geral' };
}
