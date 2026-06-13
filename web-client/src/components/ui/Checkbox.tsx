import React from 'react';
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> { label: string; }
export default function Checkbox({ label, ...props }: CheckboxProps): JSX.Element { return <label><input type="checkbox" {...props} />{label}</label>; }
