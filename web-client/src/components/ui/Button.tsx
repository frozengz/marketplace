import React from 'react';
import styles from './Ui.module.css';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary'; }
export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps): JSX.Element { return <button className={`${styles.button} ${styles[variant]} ${className}`} {...props} />; }
