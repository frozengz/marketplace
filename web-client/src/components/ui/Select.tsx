import React from 'react';
export interface SelectOption { value: string; label: string; }
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { options: SelectOption[]; }
export default function Select({ options, ...props }: SelectProps): JSX.Element { return <select {...props}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>; }
