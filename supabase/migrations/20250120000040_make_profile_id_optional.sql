-- Tornar profile_id opcional na tabela patients
-- Isso permite que médicos cadastrem pacientes que ainda não têm conta no sistema

ALTER TABLE public.patients 
ALTER COLUMN profile_id DROP NOT NULL;

-- Atualizar comentário para esclarecer o uso
COMMENT ON COLUMN public.patients.profile_id IS 'Referência ao perfil do usuário paciente (opcional - null para pacientes sem conta no sistema)';

-- Atualizar política para pacientes visualizarem seus dados
-- Agora precisa verificar se profile_id não é null
DROP POLICY IF EXISTS "Patients can view their own data" ON public.patients;
CREATE POLICY "Patients can view their own data"
  ON public.patients FOR SELECT
  USING (profile_id IS NOT NULL AND profile_id = (select auth.uid()));

-- Atualizar política para pacientes atualizarem seus dados
DROP POLICY IF EXISTS "Patients can update their own basic info" ON public.patients;
CREATE POLICY "Patients can update their own basic info"
  ON public.patients FOR UPDATE
  USING (profile_id IS NOT NULL AND profile_id = (select auth.uid()))
  WITH CHECK (profile_id IS NOT NULL AND profile_id = (select auth.uid()));