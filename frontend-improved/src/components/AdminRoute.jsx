import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/client';
import { parseJwtRole } from '../api/normalize';

function AdminVerifyMe({ children }) {
  const [state, setState] = useState('checking');

  useEffect(() => {
    api
      .get('/api/auth/me')
      .then((res) => {
        const u = res.data?.user ?? res.data;
        const role = u?.role;
        setState(role === 'admin' ? 'ok' : 'denied');
      })
      .catch(() => setState('denied'));
  }, []);

  if (state === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p className="animate-pulse font-semibold">Loading…</p>
      </div>
    );
  }
  if (state === 'denied') {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  const jwtRole = parseJwtRole(token);
  if (jwtRole === 'admin') {
    return children;
  }
  return <AdminVerifyMe>{children}</AdminVerifyMe>;
}
