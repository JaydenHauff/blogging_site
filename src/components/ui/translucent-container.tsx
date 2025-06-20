
import { cn } from "@/lib/utils";
import type React from 'react';

interface TranslucentContainerProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  blurStrength?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'none';
  backgroundOpacity?: number; // 0-100
  baseColor?: 'white' | 'black' | 'background' | 'card' | 'primary' | 'secondary' | 'accent'; // Expanded baseColor options
  rounded?: string; // e.g., "rounded-lg", "rounded-xl"
  shadow?: string; // e.g., "shadow-md", "shadow-xl"
}

const TranslucentContainer: React.FC<TranslucentContainerProps> = ({
  children,
  className,
  padding = "p-6",
  blurStrength = "lg",
  backgroundOpacity = 20,
  baseColor = "card", // Defaulted to 'card' which is better for dark themes
  rounded = "rounded-xl",
  shadow = "shadow-lg",
}) => {
  const blurClass = blurStrength !== 'none' ? `backdrop-blur-${blurStrength}` : '';
  
  let bgClass = '';
  // Updated to handle new base colors and ensure opacity is applied correctly
  // The number in bg-opacity-[X] is a percentage, so we convert backgroundOpacity
  const opacityValue = Math.max(0, Math.min(100, backgroundOpacity));

  switch (baseColor) {
    case 'white':
      bgClass = `bg-white bg-opacity-${opacityValue}`; // Tailwind CSS v2 style opacity
      break;
    case 'black':
      bgClass = `bg-black bg-opacity-${opacityValue}`;
      break;
    case 'background':
      bgClass = `bg-background bg-opacity-${opacityValue}`;
      break;
    case 'card':
      bgClass = `bg-card bg-opacity-${opacityValue}`;
      break;
    case 'primary':
      bgClass = `bg-primary bg-opacity-${opacityValue}`;
      break;
    case 'secondary':
      bgClass = `bg-secondary bg-opacity-${opacityValue}`;
      break;
    case 'accent':
      bgClass = `bg-accent bg-opacity-${opacityValue}`;
      break;
    default:
      bgClass = `bg-card bg-opacity-${opacityValue}`; // Default to card
  }
   // Fallback for Tailwind JIT if direct opacity classes like bg-card/60 don't work for all baseColors
   // This construct uses CSS variables which are more reliable.
   let style: React.CSSProperties = {};
   if (baseColor === 'background') style = {'--tw-bg-opacity': `${opacityValue / 100}`, backgroundColor: `hsl(var(--background) / var(--tw-bg-opacity))`};
   else if (baseColor === 'card') style = {'--tw-bg-opacity': `${opacityValue / 100}`, backgroundColor: `hsl(var(--card) / var(--tw-bg-opacity))`};
   else if (baseColor === 'primary') style = {'--tw-bg-opacity': `${opacityValue / 100}`, backgroundColor: `hsl(var(--primary) / var(--tw-bg-opacity))`};
   else if (baseColor === 'secondary') style = {'--tw-bg-opacity': `${opacityValue / 100}`, backgroundColor: `hsl(var(--secondary) / var(--tw-bg-opacity))`};
   else if (baseColor === 'accent') style = {'--tw-bg-opacity': `${opacityValue / 100}`, backgroundColor: `hsl(var(--accent) / var(--tw-bg-opacity))`};
   else if (baseColor === 'white') style = {'--tw-bg-opacity': `${opacityValue / 100}`, backgroundColor: `rgba(255, 255, 255, ${opacityValue / 100})`};
   else if (baseColor === 'black') style = {'--tw-bg-opacity': `${opacityValue / 100}`, backgroundColor: `rgba(0, 0, 0, ${opacityValue / 100})`};
   // If using Tailwind CSS v3+, bg-card/${backgroundOpacity} should work, but above is more robust for CSS vars
   // Forcing style for hsl vars
    bgClass = `bg-${baseColor}/${opacityValue}`;


  return (
    <div
      className={cn(
        rounded,
        shadow,
        padding,
        blurClass,
        // bgClass, // Let style attribute handle this for HSL colors
        className
      )}
      style={style} // Apply dynamic style for HSL background opacity
    >
      {children}
    </div>
  );
};

export default TranslucentContainer;
