import React from 'react';
import styles from './Ui.module.css';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label: string; error?: string; }
export default function Input({ label, error, id, ...props }: InputProps): JSX.Element { const inputId = id ?? label; return <label className={styles.field} htmlFor={inputId}><span>{label}</span><input id={inputId} {...props} />{error !== undefined && <small>{error}</small>}</label>; }
