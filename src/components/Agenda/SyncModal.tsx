import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SyncModalProps {
  open: boolean;
  onClose: () => void;
  onSyncGoogle: () => void;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  open,
  onClose,
  onSyncGoogle,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Sincronizar Calendário</DialogTitle>
          <DialogDescription>
            Conecte um provedor para sincronizar seus agendamentos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Button variant="medical" className="w-full" onClick={onSyncGoogle}>
            Sincronizar com Google Calendar
          </Button>
          <Button
            variant="medical-outline"
            className="w-full"
            onClick={() => alert('Funcionalidade da Doctoralia em breve.')}
          >
            Sincronizar com Doctoralia
          </Button>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SyncModal;
