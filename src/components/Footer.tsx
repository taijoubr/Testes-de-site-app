import React from 'react';
import { Code2, Github, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveView, siteConfig, services } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {siteConfig?.logoUrl ? (
                <div className="h-10 max-w-[170px] flex items-center justify-center p-1 rounded-xl bg-slate-900 border border-slate-800">
                  <img 
                    src={siteConfig.logoUrl} 
                    alt={siteConfig.companyName || 'Logo'} 
                    className="max-h-8 max-w-[150px] object-contain rounded"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
              )}
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  {siteConfig?.companyName || 'NCodes Technologies'}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Transformamos ideias em soluções digitais de alta performance. Especialistas em sistemas web
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-pink-500/50 transition-all"
                title="Siga no Instagram @ncodes.tech"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setActiveView('home')} className="hover:text-blue-400 transition-colors">
                  Início
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('services')} className="hover:text-blue-400 transition-colors">
                  Serviços
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('portfolio')} className="hover:text-blue-400 transition-colors">
                  Portfólio de Projetos
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('about')} className="hover:text-blue-400 transition-colors">
                  Sobre a NCodes
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('contact')} className="hover:text-blue-400 transition-colors">
                  Contato
                </button>
              </li>
            </ul>
          </div>

          {/* Services Quicklist */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Soluções</h4>
            <ul className="space-y-2 text-sm">
              {services && services.length > 0 ? (
                services.map((service) => (
                  <li key={service.id || service.title}>
                    <button
                      type="button"
                      onClick={() => setActiveView('services')}
                      className="hover:text-blue-400 transition-colors text-left cursor-pointer"
                    >
                      {service.title}
                    </button>
                  </li>
                ))
              ) : (
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('services')}
                    className="hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    Serviços Digitais
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Atendimento</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{siteConfig?.whatsapp || siteConfig?.phone || '(11) 98765-4321'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{siteConfig?.email || 'contato@ncodes.com.br'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{siteConfig?.address || 'Av. Paulista, 1000 - São Paulo, SP'}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NCodes Technologies. Todos os direitos reservados.</p>
          <div className="flex items-center gap-1">
            <span>Desenvolvido com excelência técnica por NCodes Tech</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
