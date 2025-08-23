import { useEffect } from 'react';

export const useSeo = () => {
  useEffect(() => {
    document.title = 'Entrar ou criar conta | MedAssist Pro';
    const desc = 'Autenticação segura para médicos e pacientes';
    const canonicalHref = `${window.location.origin}/auth`;

    const metaDesc =
      document.querySelector('meta[name="description"]') ||
      document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    metaDesc.setAttribute('content', desc);
    document.head.appendChild(metaDesc);

    const canonical =
      document.querySelector('link[rel="canonical"]') ||
      document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', canonicalHref);
    document.head.appendChild(canonical);
  }, []);
};