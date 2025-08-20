-- Correção definitiva para recursão infinita nas políticas RLS da tabela profiles
-- Esta migração implementa uma solução que evita completamente a recursão

-- ========================================
-- REMOVER TODAS AS POLÍTICAS PROBLEMÁTICAS
-- ========================================

-- Remover todas as políticas existentes na tabela profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Doctors can view patient profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can only view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- ========================================
-- CRIAR POLÍTICAS SEGURAS SEM RECURSÃO
-- ========================================

-- Política para usuários verem apenas seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Política para usuários inserirem apenas seu próprio perfil
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Política para usuários atualizarem apenas seu próprio perfil
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ========================================
-- DOCUMENTAÇÃO E COMENTÁRIOS
-- ========================================

COMMENT ON TABLE public.profiles IS 
'Perfis de usuários com informações básicas. '
'IMPORTANTE: Esta tabela usa políticas RLS não-recursivas. '
'Médicos acessam dados de pacientes através da tabela patients, não profiles.';

COMMENT ON POLICY "Users can view own profile" ON public.profiles IS 
'Permite que usuários vejam apenas seus próprios perfis. '
'Evita recursão infinita ao não fazer consultas na própria tabela profiles.';

-- ========================================
-- VERIFICAÇÃO DE SEGURANÇA
-- ========================================

-- Confirmar que RLS está habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Log da correção
DO $$
BEGIN
  RAISE NOTICE 'Políticas RLS da tabela profiles corrigidas para evitar recursão infinita';
  RAISE NOTICE 'Médicos devem acessar dados de pacientes via tabela patients';
END $$;