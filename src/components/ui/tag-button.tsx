import { ReactNode } from "react";

interface TagButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TagButton = ({ children, className = "", onClick }: TagButtonProps) => {
  const baseClasses = "bg-pure-white bg-opacity-30 h-full px-5 py-1 rounded-xl align-middle";
  
  return (
    <button 
      className={`${baseClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
