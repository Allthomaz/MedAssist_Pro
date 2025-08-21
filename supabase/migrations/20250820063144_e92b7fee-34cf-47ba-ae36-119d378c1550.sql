-- Corrigir problema de recursão infinita nas políticas RLS
-- Primeiro, remover as políticas problemáticas da tabela patients
DROP POLICY IF EXISTS "Doctors can insert patients" ON public.patients;
DROP POLICY IF EXISTS "Doctors can view their own patients" ON public.patients;
DROP POLICY IF EXISTS "Doctors can update their patients" ON public.patients;

-- Recriar políticas mais simples que não causam recursão
CREATE POLICY "Doctors can manage their patients" 
ON public.patients 
FOR ALL
USING (doctor_id = (select auth.uid()));

-- Política específica para inserção sem verificação na tabela profiles
CREATE POLICY "Users can insert patients as doctor" 
ON public.patients 
FOR INSERT 
WITH CHECK (doctor_id = (select auth.uid()));

-- Manter as políticas dos pacientes
-- (já existentes, apenas para referência)
-- CREATE POLICY "Patients can view their own data" 
-- ON public.patients 
-- FOR SELECT 
-- USING (profile_id = auth.uid());

-- CREATE POLICY "Patients can update their own basic info" 
-- ON public.patients 
-- FOR UPDATE 
-- USING (profile_id = auth.uid())
-- WITH CHECK (profile_id = auth.uid());