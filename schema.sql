-- Supabase Schema for Sphera SaaS

-- 1. Producers (Extends auth.users)
CREATE TABLE public.producers (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  mp_access_token text,
  mp_public_key text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.producers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Produtores podem ver a própria conta" ON public.producers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Produtores podem atualizar a própria conta" ON public.producers FOR UPDATE USING (auth.uid() = id);

-- 2. Events
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  producer_id uuid REFERENCES public.producers(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  location text,
  checkout_primary_color text DEFAULT '#F97316', -- Laranja padrão
  checkout_font text DEFAULT 'Inter',
  checkout_logo_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
-- Todos podem ver eventos (para a landing page)
CREATE POLICY "Eventos são públicos" ON public.events FOR SELECT USING (true);
CREATE POLICY "Produtores podem gerenciar seus eventos" ON public.events FOR ALL USING (auth.uid() = producer_id);

-- 3. Ticket Types (Lotes)
CREATE TABLE public.ticket_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  price numeric(10,2) NOT NULL,
  available_quantity integer NOT NULL DEFAULT 0,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.ticket_types ENABLE ROW LEVEL SECURITY;
-- Todos podem ver os lotes (para a landing page)
CREATE POLICY "Lotes são públicos" ON public.ticket_types FOR SELECT USING (true);
CREATE POLICY "Produtores gerenciam lotes de seus eventos" ON public.ticket_types FOR ALL USING (
  EXISTS (SELECT 1 FROM public.events WHERE events.id = ticket_types.event_id AND events.producer_id = auth.uid())
);

-- 4. Tickets (Ingressos Vendidos/Reservados)
CREATE TABLE public.tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_type_id uuid REFERENCES public.ticket_types(id) ON DELETE RESTRICT NOT NULL,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  owner_name text NOT NULL,
  owner_cpf text NOT NULL,
  buyer_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- pending, paid, used, cancelled
  payment_session_id text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
-- Produtores podem ver tickets dos seus eventos
CREATE POLICY "Produtores veem tickets de seus eventos" ON public.tickets FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.events WHERE events.id = tickets.event_id AND events.producer_id = auth.uid())
);
-- Backend gerencia a criação/update de tickets via service_role, então não precisa de policy de INSERT pública.

-- Trigger para criar produtor automaticamente quando usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.producers (id, name)
  VALUES (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
