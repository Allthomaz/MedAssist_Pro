-- Correção de recursão infinita nas políticas RLS da tabela profiles
-- O problema estava na política "Doctors can view patient profiles" que fazia
-- uma consulta recursiva na própria tabela profiles

-- ========================================
-- CORRIGIR POLÍTICAS RLS DA TABELA PROFILES
-- ========================================

-- Remover a política problemática que causa recursão infinita
DROP POLICY IF EXISTS "Doctors can view patient profiles" ON public.profiles;

-- POLÍTICA REMOVIDA: A política "Doctors can view patient profiles" causava recursão infinita
-- Médicos devem acessar dados de pacientes através da tabela patients, não profiles

-- Alternativa: Criar uma política mais restritiva que usa apenas auth.uid()
-- Esta política permite apenas que usuários vejam seus próprios perfis
-- e remove completamente a funcionalidade de médicos verem pacientes via profiles
DROP POLICY IF EXISTS "Doctors can view patient profiles" ON public.profiles;
CREATE POLICY "Users can only view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Comentário explicativo
COMMENT ON POLICY "Users can only view their own profile" ON public.profiles IS 
'Política restritiva que permite apenas que usuários vejam seus próprios perfis. '
'Médicos devem acessar dados de pacientes através da tabela patients, não profiles.';

-- Verificar se existem outras políticas que podem causar problemas similares
-- e documentar a solução
COMMENT ON TABLE public.profiles IS 
'Perfis de usuários com informações estendidas. '
'IMPORTANTE: Evitar consultas recursivas nas políticas RLS desta tabela. '
'Para acesso a dados de pacientes por médicos, usar a tabela patients.';