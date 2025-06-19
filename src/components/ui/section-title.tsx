import { cn } from "@/lib/utils";
import type React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  alignment?: 'left' | 'center' | 'right';
}

const SectionTitle: React.FC<SectionTitleProps> = ({ 
  title, 
  subtitle, 
  className, 
  titleClassName,
  subtitleClassName,
  alignment = 'center' 
}) => {
  const textAlignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[alignment];

  return (
    <div className={cn("mb-12 md:mb-16", textAlignClass, className)}>
      <h2 className={cn(
        "text-4xl sm:text-5xl font-headline font-bold text-primary mb-3",
        alignment === 'center' && 'mx-auto',
        titleClassName
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "text-lg text-muted-foreground max-w-2xl", 
          alignment === 'center' && 'mx-auto',
          alignment === 'left' ? 'mr-auto' : '',
          alignment === 'right' ? 'ml-auto' : '',
          subtitleClassName
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
