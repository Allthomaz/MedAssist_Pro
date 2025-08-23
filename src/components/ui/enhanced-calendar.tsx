import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format, parse, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { cn } from '@/lib/utils';
import { CalendarClassNames } from '../../types/common';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export type EnhancedCalendarProps = {
  className?: string;
  classNames?: CalendarClassNames;
  showOutsideDays?: boolean;
  onDateChange?: (date: Date | undefined) => void;
  value?: Date;
  disabled?: (date: Date) => boolean;
};

function EnhancedCalendar({
  className,
  classNames,
  showOutsideDays = true,
  onDateChange,
  value,
  disabled,
}: EnhancedCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    value || new Date()
  );
  const [dateInput, setDateInput] = React.useState<string>(
    value ? format(value, 'dd/MM/yyyy') : ''
  );

  // Gerar anos de 1900 até o ano atual
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => 1900 + i
  ).reverse();

  // Meses do ano
  const months = [
    { value: 0, label: 'Janeiro' },
    { value: 1, label: 'Fevereiro' },
    { value: 2, label: 'Março' },
    { value: 3, label: 'Abril' },
    { value: 4, label: 'Maio' },
    { value: 5, label: 'Junho' },
    { value: 6, label: 'Julho' },
    { value: 7, label: 'Agosto' },
    { value: 8, label: 'Setembro' },
    { value: 9, label: 'Outubro' },
    { value: 10, label: 'Novembro' },
    { value: 11, label: 'Dezembro' },
  ];

  const handleYearChange = (year: string) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(parseInt(year));
    setCurrentMonth(newDate);
  };

  const handleMonthChange = (month: string) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(parseInt(month));
    setCurrentMonth(newDate);
  };

  const handleDateInputChange = (inputValue: string) => {
    setDateInput(inputValue);

    // Tentar fazer parse da data no formato dd/mm/yyyy
    if (inputValue.length === 10) {
      const parsedDate = parse(inputValue, 'dd/MM/yyyy', new Date());
      if (isValid(parsedDate)) {
        setCurrentMonth(parsedDate);
        onDateChange?.(parsedDate);
      }
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDateInput(format(date, 'dd/MM/yyyy'));
      setCurrentMonth(date);
    }
    onDateChange?.(date);
  };

  // Atualizar input quando o valor externo mudar
  React.useEffect(() => {
    if (value) {
      setDateInput(format(value, 'dd/MM/yyyy'));
      setCurrentMonth(value);
    }
  }, [value]);

  return (
    <div className="space-y-4">
      {/* Campo de digitação direta */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Digite a data (dd/mm/aaaa)
        </Label>
        <Input
          type="text"
          placeholder="dd/mm/aaaa"
          value={dateInput}
          onChange={e => handleDateInputChange(e.target.value)}
          className="text-center"
          maxLength={10}
        />
      </div>

      {/* Seletores de Ano e Mês */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Label className="text-sm font-medium">Ano</Label>
          <Select
            value={currentMonth.getFullYear().toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Label className="text-sm font-medium">Mês</Label>
          <Select
            value={currentMonth.getMonth().toString()}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Calendário */}
      <DayPicker
        mode="single"
        selected={value}
        onSelect={handleDateSelect}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        showOutsideDays={showOutsideDays}
        disabled={disabled}
        locale={ptBR}
        className={cn('p-3', className)}
        classNames={{
          months:
            'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
          month: 'space-y-4',
          caption: 'flex justify-center pt-1 relative items-center',
          caption_label: 'text-sm font-medium',
          nav: 'space-x-1 flex items-center',
          nav_button: cn(
            buttonVariants({ variant: 'outline' }),
            'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
          ),
          nav_button_previous: 'absolute left-1',
          nav_button_next: 'absolute right-1',
          table: 'w-full border-collapse space-y-1',
          head_row: 'flex',
          head_cell:
            'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
          row: 'flex w-full mt-2',
          cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
          day: cn(
            buttonVariants({ variant: 'ghost' }),
            'h-9 w-9 p-0 font-normal aria-selected:opacity-100'
          ),
          day_range_end: 'day-range-end',
          day_selected:
            'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
          day_today: 'bg-accent text-accent-foreground',
          day_outside:
            'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
          day_disabled: 'text-muted-foreground opacity-50',
          day_range_middle:
            'aria-selected:bg-accent aria-selected:text-accent-foreground',
          day_hidden: 'invisible',
          ...classNames,
        }}
        components={{
          IconLeft: () => <ChevronLeft className="h-4 w-4" />,
          IconRight: () => <ChevronRight className="h-4 w-4" />,
        }}
      />
    </div>
  );
}

EnhancedCalendar.displayName = 'EnhancedCalendar';

export { EnhancedCalendar };
