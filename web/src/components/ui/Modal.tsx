import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={cn(
        "relative z-50 w-full max-w-lg rounded-xl bg-surface dark:bg-surface-dark shadow-xl",
        "border border-gray-200 dark:border-gray-800",
        "flex flex-col mx-4 sm:mx-0 max-h-[90vh]",
        className
      )}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-text dark:text-text-dark">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-text-muted hover:bg-gray-100 dark:text-text-mutedDark dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 overflow-y-auto">
          {children}
        </div>
        
        <div className="flex items-center justify-end p-4 border-t border-gray-200 dark:border-gray-800 gap-3">
          <Button variant="outline" onClick={onClose}>
            {t('cancel', 'Cancel')}
          </Button>
          <Button onClick={onClose}>
            {t('save', 'Save')}
          </Button>
        </div>
      </div>
    </div>
  );
}
