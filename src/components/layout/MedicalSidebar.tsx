import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Video,
  ClipboardList,
  Settings,
  Activity,
  LogOut,
  Calendar,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/stores/useAuthStore';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Pacientes', href: '/patients', icon: Users },
  { name: 'Consultas', href: '/consultations', icon: Video },
  { name: 'Agendamentos', href: '/appointments', icon: Calendar },
  { name: 'Modelos', href: '/templates', icon: ClipboardList },
  { name: 'Documentos', href: '/documents', icon: FileText },
  { name: 'Analytics', href: '/analytics', icon: Activity },
];

const secondaryNavigation = [
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export function MedicalSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } catch (err) {
      String(err);
    } finally {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } finally {
        window.location.href = '/auth';
      }
    }
  };

  return (
    <div className="premium-sidebar h-full flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center gap-3 p-6 border-b border-sidebar-border/50">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl medical-gradient shadow-lg">
          <Activity className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-sidebar-foreground medical-heading">
            MedAssist Pro
          </h1>
          <p className="text-xs text-sidebar-foreground/70 medical-subheading">
            Assistente Clínico Digital
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="space-y-1">
          {navigation.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  'premium-sidebar-item flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group',
                  isActive
                    ? 'bg-medical-blue/10 text-medical-blue border border-medical-blue/20 active'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300',
                    isActive
                      ? 'bg-medical-blue text-white shadow-md'
                      : 'bg-sidebar-accent/50 text-sidebar-foreground/60 group-hover:bg-medical-blue/20 group-hover:text-medical-blue'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="pt-6 mt-6 border-t border-sidebar-border/30">
          <p className="px-4 mb-3 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider medical-subheading">
            Ações Rápidas
          </p>
          <Button
            className="w-full justify-start bg-medical-blue/10 hover:bg-medical-blue/20 text-medical-blue border border-medical-blue/20 premium-button"
            size="sm"
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-medical-blue/20 mr-2">
              <Video className="w-3 h-3" />
            </div>
            Nova Consulta
          </Button>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-sidebar-border/30 space-y-2">
        {secondaryNavigation.map(item => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                'premium-sidebar-item flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group',
                isActive
                  ? 'bg-medical-blue/10 text-medical-blue border border-medical-blue/20 active'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1'
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300',
                  isActive
                    ? 'bg-medical-blue text-white shadow-md'
                    : 'bg-sidebar-accent/50 text-sidebar-foreground/60 group-hover:bg-medical-blue/20 group-hover:text-medical-blue'
                )}
              >
                <item.icon className="w-4 h-4" />
              </div>
              <span className="font-medium">{item.name}</span>
            </NavLink>
          );
        })}

        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/60 hover:text-medical-alert hover:bg-medical-alert/10 transition-all duration-300 mt-4 premium-button"
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
          aria-label="Sair da conta"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-accent/50 mr-3 transition-all duration-300 group-hover:bg-medical-alert/20">
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
          </div>
          <span className="font-medium">
            {isLoggingOut ? 'Saindo...' : 'Sair'}
          </span>
        </Button>
      </div>
    </div>
  );
}
