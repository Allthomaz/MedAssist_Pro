-- Migração para adicionar políticas RLS essenciais para as tabelas patients e appointments
-- Data: 2025-08-25 19:15:00
-- Objetivo: Resolver problemas de permissão 401 Unauthorized

-- Políticas para a tabela patients
-- Remover políticas existentes primeiro
DROP POLICY IF EXISTS "Doctors can view their own patients" ON patients;
DROP POLICY IF EXISTS "Doctors can create their own patients" ON patients;
DROP POLICY IF EXISTS "Doctors can update their own patients" ON patients;
DROP POLICY IF EXISTS "Doctors can delete their own patients" ON patients;
DROP POLICY IF EXISTS "Patients can view their own data" ON patients;

-- Permitir que médicos vejam apenas seus próprios pacientes
CREATE POLICY "Doctors can view their own patients" ON patients
  FOR SELECT
  USING (auth.uid() = doctor_id);

-- Permitir que médicos criem pacientes associados ao seu ID
CREATE POLICY "Doctors can create their own patients" ON patients
  FOR INSERT
  WITH CHECK (auth.uid() = doctor_id);

-- Permitir que médicos atualizem apenas seus próprios pacientes
CREATE POLICY "Doctors can update their own patients" ON patients
  FOR UPDATE
  USING (auth.uid() = doctor_id)
  WITH CHECK (auth.uid() = doctor_id);

-- Permitir que médicos deletem apenas seus próprios pacientes
CREATE POLICY "Doctors can delete their own patients" ON patients
  FOR DELETE
  USING (auth.uid() = doctor_id);

-- Permitir que pacientes vejam seus próprios dados
CREATE POLICY "Patients can view their own data" ON patients
  FOR SELECT
  USING (auth.uid() = profile_id);

-- Políticas para a tabela appointments
-- Remover políticas existentes primeiro
DROP POLICY IF EXISTS "Doctors can view their own appointments" ON appointments;
DROP POLICY IF EXISTS "Patients can view their appointments" ON appointments;
DROP POLICY IF EXISTS "Doctors can create appointments" ON appointments;
DROP POLICY IF EXISTS "Doctors can update their own appointments" ON appointments;
DROP POLICY IF EXISTS "Doctors can delete their own appointments" ON appointments;

-- Permitir que médicos visualizem apenas seus próprios agendamentos
CREATE POLICY "Doctors can view their own appointments" ON appointments
  FOR SELECT
  USING (auth.uid() = doctor_id);

-- Permitir que pacientes visualizem seus agendamentos
CREATE POLICY "Patients can view their appointments" ON appointments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.patients p
      WHERE p.id = patient_id AND p.profile_id = auth.uid()
    )
  );

-- Permitir que médicos criem agendamentos
CREATE POLICY "Doctors can create appointments" ON appointments
  FOR INSERT
  WITH CHECK (auth.uid() = doctor_id);

-- Permitir que médicos atualizem apenas seus próprios agendamentos
CREATE POLICY "Doctors can update their own appointments" ON appointments
  FOR UPDATE
  USING (auth.uid() = doctor_id)
  WITH CHECK (auth.uid() = doctor_id);

-- Permitir que médicos deletem apenas seus próprios agendamentos
CREATE POLICY "Doctors can delete their own appointments" ON appointments
  FOR DELETE
  USING (auth.uid() = doctor_id);

-- Garantir que RLS está habilitado nas tabelas (caso não esteja)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;