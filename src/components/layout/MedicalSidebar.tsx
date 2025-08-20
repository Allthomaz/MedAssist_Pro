import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Video, 
  ClipboardList,
  Settings,
  Activity,
  Stethoscope,
  LogOut,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

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
  const navigate = useNavigate();
  const { signOut } = useAuth();

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Logo Section */}
      <div className="flex items-center gap-3 p-6 border-b border-border">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg medical-gradient">
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">MedAssist Pro</h1>
          <p className="text-xs text-muted-foreground">Assistente Clínico Digital</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-medical-blue text-medical-blue-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground medical-card-hover"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="pt-6 mt-6 border-t border-border">
          <p className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Ações Rápidas
          </p>
          <Button variant="medical" className="w-full justify-start" size="sm">
            <Video className="w-4 h-4" />
            Nova Consulta
          </Button>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border space-y-2">
        {secondaryNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-medical-blue text-medical-blue-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          );
        })}
        
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          size="sm"
          onClick={async () => {
            await signOut();
            navigate("/auth", { replace: true });
          }}
          aria-label="Sair da conta"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}