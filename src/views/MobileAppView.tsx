import React, { useState } from 'react';
import { 
  Smartphone, 
  Home, 
  FolderGit2, 
  DollarSign, 
  MessageSquare, 
  User, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  QrCode, 
  ShieldCheck,
  Bell,
  Plus,
  Globe,
  Edit3,
  Lock,
  Upload,
  Image
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { compressAndResizeImage } from '../utils/imageUtils';

export const MobileAppView: React.FC = () => {
  const { 
    mobileSimDevice, 
    setMobileSimDevice, 
    projects, 
    financials, 
    chatMessages, 
    sendChatMessage, 
    currentUser,
    setActiveView,
    isClientAuthenticated,
    siteConfig,
    updateSiteConfig,
    isAdminAuthenticated
  } = useApp();

  const [bottomNav, setBottomNav] = useState<'home' | 'projects' | 'financial' | 'chat' | 'profile'>('home');
  const [mobileChatInput, setMobileChatInput] = useState('');

  // Mobile site config update state
  const [mHeroTitle, setMHeroTitle] = useState(siteConfig?.heroTitle || '');
  const [mHeroBadge, setMHeroBadge] = useState(siteConfig?.heroBadge || '');
  const [mAnnouncement, setMAnnouncement] = useState(siteConfig?.announcementBanner || '');
  const [mLogoUrl, setMLogoUrl] = useState(siteConfig?.logoUrl || '');
  const [mSavedMsg, setMSavedMsg] = useState(false);
  const [isUpdatingMobile, setIsUpdatingMobile] = useState(false);

  React.useEffect(() => {
    if (siteConfig) {
      setMHeroTitle(siteConfig.heroTitle || '');
      setMHeroBadge(siteConfig.heroBadge || '');
      setMAnnouncement(siteConfig.announcementBanner || '');
      setMLogoUrl(siteConfig.logoUrl || '');
    }
  }, [siteConfig]);

  const handleMobileLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressAndResizeImage(file);
        setMLogoUrl(compressedBase64);
      } catch (err) {
        console.error('Erro ao comprimir imagem:', err);
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setMLogoUrl(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleMobileUpdateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingMobile(true);
    await updateSiteConfig({
      heroTitle: mHeroTitle,
      heroBadge: mHeroBadge,
      announcementBanner: mAnnouncement,
      logoUrl: mLogoUrl
    });
    setIsUpdatingMobile(false);
    setMSavedMsg(true);
    setTimeout(() => setMSavedMsg(false), 3000);
  };

  const activeProject = projects[0];

  const handleMobileSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileChatInput.trim()) {
      sendChatMessage(mobileChatInput.trim());
      setMobileChatInput('');
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-5xl mx-auto space-y-6">
      
      {/* Device Switcher Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-500" />
            <span>Simulador de Aplicativo Mobile Flutter</span>
          </h2>
          <p className="text-xs text-slate-500">
            Interface nativa desenvolvida em Flutter (Material Design 3) conectada ao mesmo banco de dados em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm">
            iPhone (iOS)
          </span>
        </div>
      </div>

      {/* Smartphone Frame Container */}
      <div className="flex justify-center items-center py-4">
        
        <div className={`w-[360px] sm:w-[390px] h-[760px] bg-slate-950 rounded-[50px] p-4 shadow-2xl border-4 ${
          mobileSimDevice === 'iphone' ? 'border-slate-800 relative' : 'border-slate-900 rounded-[40px]'
        } flex flex-col justify-between overflow-hidden relative`}>

          {/* Notch / Dynamic Island for iPhone */}
          {mobileSimDevice === 'iphone' && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-900 rounded-full z-50 flex items-center justify-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />
              <div className="w-2 h-2 rounded-full bg-blue-900/60" />
            </div>
          )}

          {/* Phone Screen Container */}
          <div className="w-full h-full bg-slate-900 text-white rounded-[36px] overflow-hidden flex flex-col justify-between pt-6">
            
            {/* Top Bar Flutter */}
            <div className="px-4 pt-2 pb-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs">
                  NC
                </div>
                <span className="tracking-tight text-white font-extrabold">NCodes App</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
            </div>

            {/* Screen Content Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              
              {/* HOME SCREEN */}
              {bottomNav === 'home' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900/40 via-teal-900/40 to-slate-900 border border-emerald-500/30 space-y-2">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Sincronizado</span>
                    <h3 className="text-base font-extrabold text-white">Olá, {currentUser.name.split(' ')[0]}!</h3>
                    <p className="text-[11px] text-slate-300">Seu aplicativo Flutter está conectado ao mesmo banco de dados em tempo real.</p>
                  </div>

                  {activeProject && (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-400">Projeto Ativo</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300">
                          {activeProject.progressPercentage}%
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm">{activeProject.title}</h4>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${activeProject.progressPercentage}%` }} />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActiveView(isClientAuthenticated ? 'client_portal' : 'client_auth')}
                      className="p-3 rounded-2xl bg-indigo-600 text-white font-bold text-left space-y-1 shadow-md"
                    >
                      <Sparkles className="w-4 h-4" />
                      <p className="text-xs">Área do Cliente</p>
                    </button>

                    <button
                      onClick={() => setBottomNav('financial')}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-bold text-left space-y-1"
                    >
                      <QrCode className="w-4 h-4 text-emerald-400" />
                      <p className="text-xs">Pagamento Pix</p>
                    </button>
                  </div>
                </div>
              )}

              {/* PROJECTS SCREEN */}
              {bottomNav === 'projects' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <h3 className="font-bold text-sm text-white">Seus Projetos</h3>
                  {projects.map(p => (
                    <div key={p.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-blue-400 font-bold">{p.id}</span>
                        <span className="text-emerald-400 font-bold">{p.progressPercentage}%</span>
                      </div>
                      <h4 className="font-bold text-white">{p.title}</h4>
                      <div className="space-y-1">
                        {p.tasks.slice(0, 2).map(t => (
                          <div key={t.id} className="flex items-center gap-2 text-[10px] text-slate-300">
                            <CheckCircle2 className={`w-3 h-3 ${t.completed ? 'text-emerald-400' : 'text-slate-600'}`} />
                            <span className={t.completed ? 'line-through' : ''}>{t.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* FINANCIAL SCREEN */}
              {bottomNav === 'financial' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <h3 className="font-bold text-sm text-white">Extrato & Cobranças Pix</h3>
                  {financials.map(f => (
                    <div key={f.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">{f.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${f.status === 'pago' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'}`}>
                          {f.status}
                        </span>
                      </div>
                      <p className="text-sm font-extrabold text-emerald-400">R$ {f.amount.toLocaleString('pt-BR')}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* CHAT SCREEN */}
              {bottomNav === 'chat' && (
                <div className="space-y-3 animate-in fade-in duration-200 h-full flex flex-col justify-between">
                  <div className="space-y-2 overflow-y-auto max-h-96">
                    {chatMessages.map(m => (
                      <div key={m.id} className={`p-2.5 rounded-xl text-[11px] ${m.senderRole === 'client' ? 'bg-emerald-600 text-white ml-6' : 'bg-slate-950 border border-slate-800 text-slate-200 mr-6'}`}>
                        <p className="font-bold text-[9px] opacity-70">{m.senderName}</p>
                        <p>{m.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleMobileSendChat} className="flex gap-1.5 pt-2">
                    <input
                      type="text"
                      value={mobileChatInput}
                      onChange={e => setMobileChatInput(e.target.value)}
                      placeholder="Mensagem..."
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                    <button type="submit" className="p-2 rounded-xl bg-emerald-600 text-white">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}

              {/* PROFILE & SITE MANAGEMENT SCREEN */}
              {bottomNav === 'profile' && (
                <div className="space-y-4 animate-in fade-in duration-200 text-center">
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-14 h-14 rounded-full mx-auto border-2 border-emerald-500 object-cover shadow-lg" />
                  <div>
                    <h3 className="font-bold text-white text-sm">{currentUser.name}</h3>
                    <p className="text-[10px] text-slate-400">{currentUser.email}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-left text-[11px] space-y-1">
                    <p className="text-slate-400">Cargo: <strong className="text-white">{currentUser.role.toUpperCase()}</strong></p>
                    <p className="text-slate-400">Status Banco: <strong className="text-emerald-400">Firestore Realtime Sync</strong></p>
                  </div>

                  {/* Mobile Site Update Card for Admins */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-blue-500/30 text-left space-y-3 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-1.5 text-blue-400 font-extrabold text-[11px]">
                        <Globe className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        <span>Atualizar Site via Mobile</span>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-mono">LIVE</span>
                    </div>

                    {mSavedMsg && (
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Site e App Atualizados com Sucesso!</span>
                      </div>
                    )}

                    <form onSubmit={handleMobileUpdateSite} className="space-y-2.5">
                      {/* Logo Upload Field */}
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 mb-0.5">
                          Logo da Empresa / Marca:
                        </label>
                        <div className="flex items-center gap-2">
                          {mLogoUrl && (
                            <img src={mLogoUrl} alt="Logo preview" className="w-8 h-8 object-contain rounded bg-slate-900 border border-slate-800 p-0.5" />
                          )}
                          <label className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-semibold text-blue-400 flex items-center justify-center gap-1 cursor-pointer">
                            <Upload className="w-3 h-3" />
                            <span>{mLogoUrl ? 'Trocar Logo' : 'Enviar Imagem do Logo'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleMobileLogoUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 mb-0.5">
                          Badge do Hero:
                        </label>
                        <input
                          type="text"
                          value={mHeroBadge}
                          onChange={e => setMHeroBadge(e.target.value)}
                          placeholder="Texto da Badge..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 mb-0.5">
                          Título do Hero:
                        </label>
                        <input
                          type="text"
                          value={mHeroTitle}
                          onChange={e => setMHeroTitle(e.target.value)}
                          placeholder="Título do Site..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 mb-0.5">
                          Banner de Anúncio no Topo:
                        </label>
                        <input
                          type="text"
                          value={mAnnouncement}
                          onChange={e => setMAnnouncement(e.target.value)}
                          placeholder="Banner de aviso..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isUpdatingMobile}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Globe className="w-3 h-3" />
                        <span>{isUpdatingMobile ? 'Publicando...' : 'Publicar Alterações no Site'}</span>
                      </button>
                    </form>
                  </div>

                </div>
              )}

            </div>

            {/* Flutter Material 3 Bottom Navigation Bar */}
            <div className="bg-slate-950 border-t border-slate-800 p-2 grid grid-cols-5 gap-1 text-[10px] text-center">
              <button
                onClick={() => setBottomNav('home')}
                className={`py-1.5 rounded-xl flex flex-col items-center justify-center gap-0.5 ${
                  bottomNav === 'home' ? 'text-emerald-400 font-bold bg-slate-900' : 'text-slate-500'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Início</span>
              </button>

              <button
                onClick={() => setBottomNav('projects')}
                className={`py-1.5 rounded-xl flex flex-col items-center justify-center gap-0.5 ${
                  bottomNav === 'projects' ? 'text-emerald-400 font-bold bg-slate-900' : 'text-slate-500'
                }`}
              >
                <FolderGit2 className="w-4 h-4" />
                <span>Projetos</span>
              </button>

              <button
                onClick={() => setBottomNav('financial')}
                className={`py-1.5 rounded-xl flex flex-col items-center justify-center gap-0.5 ${
                  bottomNav === 'financial' ? 'text-emerald-400 font-bold bg-slate-900' : 'text-slate-500'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Financeiro</span>
              </button>

              <button
                onClick={() => setBottomNav('chat')}
                className={`py-1.5 rounded-xl flex flex-col items-center justify-center gap-0.5 ${
                  bottomNav === 'chat' ? 'text-emerald-400 font-bold bg-slate-900' : 'text-slate-500'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
              </button>

              <button
                onClick={() => setBottomNav('profile')}
                className={`py-1.5 rounded-xl flex flex-col items-center justify-center gap-0.5 ${
                  bottomNav === 'profile' ? 'text-emerald-400 font-bold bg-slate-900' : 'text-slate-500'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Perfil</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
