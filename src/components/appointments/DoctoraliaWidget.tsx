import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
interface DoctoraliaWidgetProps {
  doctorId: string;
  widgetType?: 'big_with_calendar' | 'big' | 'medium' | 'small';
  showOpinion?: boolean;
  hideBranding?: boolean;
  saasOnly?: boolean;
  a11yTitle?: string;
}
export function DoctoraliaWidget({
  doctorId,
  widgetType = 'big_with_calendar',
  showOpinion = false,
  hideBranding = true,
  saasOnly = true,
  a11yTitle = 'Widget de marcação de consultas médicas'
}: DoctoraliaWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Limpar qualquer widget anterior
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Criar o elemento <a> para o widget
    const widgetLink = document.createElement('a');
    widgetLink.id = 'zl-url';
    widgetLink.className = 'zl-url';
    widgetLink.href = `https://www.doctoralia.com.br/${doctorId}`;
    widgetLink.rel = 'nofollow';
    widgetLink.dataset.zlwDoctor = doctorId;
    widgetLink.dataset.zlwType = widgetType;
    widgetLink.dataset.zlwOpinion = showOpinion.toString();
    widgetLink.dataset.zlwHideBranding = hideBranding.toString();
    widgetLink.dataset.zlwSaasOnly = saasOnly.toString();
    widgetLink.dataset.zlwA11yTitle = a11yTitle;
    widgetLink.textContent = `${doctorId} - Doctoralia.com.br`;

    // Adicionar o link ao container
    if (containerRef.current) {
      containerRef.current.appendChild(widgetLink);
    }

    // Criar e adicionar o script do Doctoralia
    const script = document.createElement('script');
    script.textContent = `!function($_x,_s,id){var js,fjs=$_x.getElementsByTagName(_s)[0];if(!$_x.getElementById(id)){js = $_x.createElement(_s);js.id = id;js.src = "//platform.docplanner.com/js/widget.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","zl-widget-s");`;

    // Adicionar o script ao container
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [doctorId, widgetType, showOpinion, hideBranding, saasOnly, a11yTitle]);
  return <Card className="border-medical-blue/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-medical-blue" />
          Agendamento via Doctoralia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-accent/50">
            
          </div>
          <p className="text-xs text-muted-foreground">
            Este widget permite que seus pacientes agendem consultas diretamente pelo Doctoralia.
            Para personalizar, edite as propriedades do componente DoctoraliaWidget.
          </p>
        </div>
      </CardContent>
    </Card>;
}