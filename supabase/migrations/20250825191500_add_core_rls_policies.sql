-- Migração para adicionar políticas RLS essenciais para as tabelas patients e appointments
-- Data: 2025-08-25 19:15:00
-- Objetivo: Resolver problemas de permissão 401 Unauthorized

-- Políticas para a tabela patients
-- Permitir que usuários autenticados vejam apenas seus próprios pacientes
CREATE POLICY "Users can view their own patients" ON patients
  FOR SELECT
  USING (auth.uid() = user_id);

-- Permitir que usuários autenticados criem pacientes associados ao seu ID
CREATE POLICY "Users can create their own patients" ON patients
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Permitir que usuários autenticados atualizem apenas seus próprios pacientes
CREATE POLICY "Users can update their own patients" ON patients
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Permitir que usuários autenticados deletem apenas seus próprios pacientes
CREATE POLICY "Users can delete their own patients" ON patients
  FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para a tabela appointments
-- Permitir que usuários autenticados vejam apenas seus próprios agendamentos
CREATE POLICY "Users can view their own appointments" ON appointments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Permitir que usuários autenticados criem agendamentos associados ao seu ID
CREATE POLICY "Users can create their own appointments" ON appointments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Permitir que usuários autenticados atualizem apenas seus próprios agendamentos
CREATE POLICY "Users can update their own appointments" ON appointments
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Permitir que usuários autenticados deletem apenas seus próprios agendamentos
CREATE POLICY "Users can delete their own appointments" ON appointments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Garantir que RLS está habilitado nas tabelas (caso não esteja)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;