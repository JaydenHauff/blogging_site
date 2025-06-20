
import { cn } from "@/lib/utils";
import type React from 'react';

interface TranslucentContainerProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  blurStrength?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'none';
  backgroundOpacity?: number; // 0-100
  baseColor?: 'white' | 'black' | 'background' | 'card' | 'primary' | 'secondary' | 'accent' | 'muted';
  rounded?: string; 
  shadow?: string; 
}

const TranslucentContainer: React.FC<TranslucentContainerProps> = ({
  children,
  className,
  padding = "p-6",
  blurStrength = "lg",
  backgroundOpacity = 80, // Default opacity for light theme might be higher
  baseColor = "card", 
  rounded = "rounded-xl",
  shadow = "shadow-lg",
}) => {
  const blurClass = blurStrength !== 'none' ? `backdrop-blur-${blurStrength}` : '';
  const opacityValue = Math.max(0, Math.min(100, backgroundOpacity));

  let backgroundColorStyle: React.CSSProperties = {};

  // Using CSS variables for background colors to ensure theme consistency
  // and applying opacity through the /<value> syntax if available or via rgba for white/black
  let effectiveBgClass = '';

  switch (baseColor) {
    case 'white':
      backgroundColorStyle = { backgroundColor: `rgba(255, 255, 255, ${opacityValue / 100})` };
      break;
    case 'black':
      backgroundColorStyle = { backgroundColor: `rgba(0, 0, 0, ${opacityValue / 100})` };
      break;
    case 'background':
      effectiveBgClass = `bg-background/${opacityValue}`;
      // For older Tailwind or specific needs:
      // backgroundColorStyle = { backgroundColor: `hsl(var(--background) / ${opacityValue / 100})` };
      break;
    case 'card':
      effectiveBgClass = `bg-card/${opacityValue}`;
      // backgroundColorStyle = { backgroundColor: `hsl(var(--card) / ${opacityValue / 100})` };
      break;
    case 'primary':
      effectiveBgClass = `bg-primary/${opacityValue}`;
      // backgroundColorStyle = { backgroundColor: `hsl(var(--primary) / ${opacityValue / 100})` };
      break;
    case 'secondary':
      effectiveBgClass = `bg-secondary/${opacityValue}`;
      // backgroundColorStyle = { backgroundColor: `hsl(var(--secondary) / ${opacityValue / 100})` };
      break;
    case 'accent':
      effectiveBgClass = `bg-accent/${opacityValue}`;
      // backgroundColorStyle = { backgroundColor: `hsl(var(--accent) / ${opacityValue / 100})` };
      break;
    case 'muted':
      effectiveBgClass = `bg-muted/${opacityValue}`;
      // backgroundColorStyle = { backgroundColor: `hsl(var(--muted) / ${opacityValue / 100})` };
      break;
    default:
      effectiveBgClass = `bg-card/${opacityValue}`;
      // backgroundColorStyle = { backgroundColor: `hsl(var(--card) / ${opacityValue / 100})` };
  }

  return (
    <div
      className={cn(
        rounded,
        shadow,
        padding,
        blurClass,
        effectiveBgClass, // Apply Tailwind JIT class for opacity
        className
      )}
      style={backgroundColorStyle} // Apply style for white/black or if specific HSL manipulation is needed
    >
      {children}
    </div>
  );
};

export default TranslucentContainer;
