import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/store/authStore';
import { router } from '@/router';
import '@/i18n';
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<React.StrictMode><AuthProvider><RouterProvider router={router} /></AuthProvider></React.StrictMode>);
