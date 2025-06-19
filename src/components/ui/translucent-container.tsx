import { cn } from "@/lib/utils";
import type React from 'react';

interface TranslucentContainerProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  blurStrength?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'none';
  backgroundOpacity?: number; // 0-100
  baseColor?: 'white' | 'black' | 'background' | 'card'; // Define base color for translucency
  rounded?: string; // e.g., "rounded-lg", "rounded-xl"
  shadow?: string; // e.g., "shadow-md", "shadow-xl"
}

const TranslucentContainer: React.FC<TranslucentContainerProps> = ({
  children,
  className,
  padding = "p-6",
  blurStrength = "lg",
  backgroundOpacity = 20,
  baseColor = "white",
  rounded = "rounded-xl",
  shadow = "shadow-lg",
}) => {
  const blurClass = blurStrength !== 'none' ? `backdrop-blur-${blurStrength}` : '';
  
  let bgClass = '';
  switch (baseColor) {
    case 'white':
      bgClass = `bg-white/${backgroundOpacity}`;
      break;
    case 'black':
      bgClass = `bg-black/${backgroundOpacity}`;
      break;
    case 'background':
      bgClass = `bg-background/${backgroundOpacity}`;
      break;
    case 'card':
      bgClass = `bg-card/${backgroundOpacity}`;
      break;
    default:
      bgClass = `bg-white/${backgroundOpacity}`;
  }

  return (
    <div
      className={cn(
        rounded,
        shadow,
        padding,
        blurClass,
        bgClass,
        className
      )}
    >
      {children}
    </div>
  );
};

export default TranslucentContainer;
