import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
}

const Label: React.FC<LabelProps> = ({ children, required = false, className = "", ...props }) => {
  return (
    <label className={`block text-sm font-medium text-gray-700 ${className}`} {...props}>
      {children}
      {required ? (
        <span className="text-red-500 ml-1" aria-hidden="true">*</span>
      ) : (
        <span className="text-gray-400 text-sm ml-1 font-normal">(Optional)</span>
      )}
    </label>
  );
};

export default Label;
