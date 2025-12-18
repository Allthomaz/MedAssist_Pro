import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';

interface Patient {
  id: string;
  full_name: string;
}

interface PatientSearchProps {
  onPatientSelect: (patientId: string) => void;
  selectedPatientId?: string;
}

export function PatientSearch({ onPatientSelect, selectedPatientId }: PatientSearchProps) {
  const [open, setOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('id, full_name')
        .order('full_name', { ascending: true });

      if (error) {
        console.error('Error fetching patients:', error);
      } else {
        setPatients(data || []);
      }
      setLoading(false);
    };

    fetchPatients();
  }, []);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedPatient
            ? selectedPatient.full_name
            : 'Selecione um paciente...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput 
            placeholder="Buscar paciente..."
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>{loading ? 'Carregando...' : 'Nenhum paciente encontrado.'}</CommandEmpty>
            <CommandGroup>
              {patients
                .filter(patient =>
                  patient.full_name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(patient => (
                <CommandItem
                  key={patient.id}
                  value={patient.full_name}
                  onSelect={() => {
                    onPatientSelect(patient.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedPatientId === patient.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {patient.full_name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
