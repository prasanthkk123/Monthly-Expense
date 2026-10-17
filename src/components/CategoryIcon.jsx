import React from 'react';
import {
  Utensils,
  ShoppingCart,
  Home,
  Zap,
  Car,
  ShoppingBag,
  Film,
  HeartPulse,
  TrendingUp,
  Plane,
  GraduationCap,
  Sparkles,
  MoreHorizontal,
  Briefcase,
  Laptop,
  Building2,
  Gift,
  PlusCircle,
  Smartphone,
  CreditCard,
  Landmark,
  Banknote,
  Wallet,
  CircleDollarSign,
  HelpCircle
} from 'lucide-react';

const ICON_MAP = {
  Utensils,
  ShoppingCart,
  Home,
  Zap,
  Car,
  ShoppingBag,
  Film,
  HeartPulse,
  TrendingUp,
  Plane,
  GraduationCap,
  Sparkles,
  MoreHorizontal,
  Briefcase,
  Laptop,
  Building2,
  Gift,
  PlusCircle,
  Smartphone,
  CreditCard,
  Landmark,
  Banknote,
  Wallet,
  CircleDollarSign,
  HelpCircle,
};

export const CategoryIcon = ({ name, className = 'w-5 h-5', style }) => {
  const IconComponent = ICON_MAP[name] || CircleDollarSign || HelpCircle;
  return <IconComponent className={className} style={style} />;
};
