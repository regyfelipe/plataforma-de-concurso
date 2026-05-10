-- ============================================================
-- MODELO DE CADASTRO — Plataforma de Concursos
-- ============================================================

-- ────────────────────────────────────────────────
-- PLANOS DE ASSINATURA
-- ────────────────────────────────────────────────
CREATE TABLE planos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome          VARCHAR(50)   NOT NULL UNIQUE,   -- '7 Dias' | '1 Mês' | '6 Meses' | '12 Meses'
  duracao_dias  INT           NOT NULL,           --  7       |  30     |  180      |  365
  preco         NUMERIC(10,2) NOT NULL,
  descricao     TEXT,
  ativo         BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em     TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- USUÁRIOS
-- ────────────────────────────────────────────────
CREATE TYPE perfil_usuario AS ENUM ('aluno', 'professor', 'admin');
CREATE TYPE status_usuario AS ENUM ('ativo', 'inativo', 'banido', 'pendente');

CREATE TABLE usuarios (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Dados de acesso
  email               VARCHAR(255) NOT NULL UNIQUE,
  senha_hash          TEXT,                           -- NULL se usar OAuth

  -- Dados pessoais
  nome                VARCHAR(150) NOT NULL,
  sobrenome           VARCHAR(150),
  cpf                 VARCHAR(14) UNIQUE,
  telefone            VARCHAR(20),
  data_nascimento     DATE,
  avatar_url          TEXT,

  -- Perfil e status
  perfil              perfil_usuario NOT NULL DEFAULT 'aluno',
  status              status_usuario NOT NULL DEFAULT 'pendente',

  -- Plano
  plano_id            UUID REFERENCES planos(id) ON DELETE SET NULL,

  -- Verificação de e-mail
  email_verificado    BOOLEAN NOT NULL DEFAULT FALSE,
  token_verificacao   TEXT,
  token_expira_em     TIMESTAMP,

  -- Auditoria
  ultimo_acesso       TIMESTAMP,
  criado_em           TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em       TIMESTAMP NOT NULL DEFAULT NOW()
);



-- ────────────────────────────────────────────────
-- SESSÕES / TOKENS DE REFRESH
-- ────────────────────────────────────────────────
CREATE TABLE sessoes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id      UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  refresh_token   TEXT NOT NULL UNIQUE,
  dispositivo     VARCHAR(255),
  ip_address      VARCHAR(45),
  expira_em       TIMESTAMP NOT NULL,
  criado_em       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- RECUPERAÇÃO DE SENHA
-- ────────────────────────────────────────────────
CREATE TABLE recuperacao_senha (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token       TEXT NOT NULL UNIQUE,
  usado       BOOLEAN NOT NULL DEFAULT FALSE,
  expira_em   TIMESTAMP NOT NULL,
  criado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- ASSINATURAS
-- ────────────────────────────────────────────────
CREATE TYPE status_assinatura AS ENUM ('ativa', 'cancelada', 'expirada', 'trial');

CREATE TABLE assinaturas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id      UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  plano_id        UUID NOT NULL REFERENCES planos(id),
  status          status_assinatura NOT NULL DEFAULT 'trial',
  inicio_em       TIMESTAMP NOT NULL DEFAULT NOW(),
  expira_em       TIMESTAMP,
  renovacao_auto  BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- ÍNDICES
-- ────────────────────────────────────────────────
CREATE INDEX idx_usuarios_email         ON usuarios(email);
CREATE INDEX idx_usuarios_status        ON usuarios(status);
CREATE INDEX idx_usuarios_plano         ON usuarios(plano_id);
CREATE INDEX idx_sessoes_usuario        ON sessoes(usuario_id);
CREATE INDEX idx_sessoes_token          ON sessoes(refresh_token);
CREATE INDEX idx_recuperacao_token      ON recuperacao_senha(token);
CREATE INDEX idx_assinaturas_usuario    ON assinaturas(usuario_id);

-- ────────────────────────────────────────────────
-- DADOS INICIAIS — Planos
-- ────────────────────────────────────────────────
INSERT INTO planos (nome, duracao_dias, preco, descricao) VALUES
  ('7 Dias',   7,   9.90,  'Acesso completo por 7 dias — ideal para testar a plataforma'),
  ('1 Mês',   30,  29.90, 'Acesso completo por 1 mês'),
  ('6 Meses',  180, 99.90, 'Acesso completo por 6 meses — economia de 44%'),
  ('12 Meses', 365, 149.90,'Acesso completo por 12 meses — melhor custo-benefício');


-- ============================================================
-- MODELO DE PERFIL DO USUÁRIO
-- ============================================================

-- ────────────────────────────────────────────────
-- PERFIL ESTENDIDO
-- ────────────────────────────────────────────────
CREATE TYPE visibilidade_perfil AS ENUM ('privado', 'basico_publico', 'completo_publico');

CREATE TABLE perfis (
  usuario_id          UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,

  -- Dados visíveis
  nome_exibicao       VARCHAR(100),              -- apelido / nome preferido
  avatar_url          TEXT,                      -- URL da foto de perfil
  bio                 VARCHAR(2000),             -- Sobre Mim
  telefone            VARCHAR(20),

  -- Preferência de carreira (ex: PF, PRF, Tribunais)
  carreira_id         UUID REFERENCES carreiras(id) ON DELETE SET NULL,

  -- Privacidade
  visibilidade        visibilidade_perfil NOT NULL DEFAULT 'privado',

  -- Redes sociais
  instagram           VARCHAR(100),
  tiktok              VARCHAR(100),
  facebook            VARCHAR(100),

  atualizado_em       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- SEGUIDORES
-- ────────────────────────────────────────────────
CREATE TABLE seguidores (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id      UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,   -- quem é seguido
  seguidor_id     UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,   -- quem segue
  criado_em       TIMESTAMP NOT NULL DEFAULT NOW(),

  UNIQUE (usuario_id, seguidor_id),
  CHECK (usuario_id <> seguidor_id)
);

-- ────────────────────────────────────────────────
-- ENDEREÇOS
-- ────────────────────────────────────────────────
CREATE TABLE enderecos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id      UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  apelido         VARCHAR(50),                   -- 'Casa', 'Trabalho', etc.
  cep             VARCHAR(9)  NOT NULL,
  logradouro      VARCHAR(200) NOT NULL,
  numero          VARCHAR(20)  NOT NULL,
  complemento     VARCHAR(100),
  referencia      VARCHAR(200),                  -- 'Próximo ao mercado, etc.'
  bairro          VARCHAR(100) NOT NULL,
  cidade          VARCHAR(100) NOT NULL,
  estado          CHAR(2)      NOT NULL,
  principal       BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- HISTÓRICO DE ALTERAÇÃO DE SENHA
-- ────────────────────────────────────────────────
CREATE TABLE historico_senhas (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  ip_address  VARCHAR(45),
  dispositivo VARCHAR(255),
  criado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- ÍNDICES — PERFIL
-- ────────────────────────────────────────────────
CREATE INDEX idx_perfis_carreira         ON perfis(carreira_id);
CREATE INDEX idx_seguidores_usuario      ON seguidores(usuario_id);
CREATE INDEX idx_seguidores_seguidor     ON seguidores(seguidor_id);
CREATE INDEX idx_enderecos_usuario       ON enderecos(usuario_id);
CREATE INDEX idx_historico_senhas_user   ON historico_senhas(usuario_id);


-- ============================================================
-- PEDIDOS (aba Pedidos do Perfil)
-- ============================================================
CREATE TYPE status_pedido AS ENUM ('pendente', 'processando', 'entregue', 'cancelado');

CREATE TABLE pedidos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo          VARCHAR(20) NOT NULL UNIQUE,   -- ex: #019D024B
  usuario_id      UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,

  -- Status
  status          status_pedido NOT NULL DEFAULT 'pendente',

  -- Descrição do que foi comprado
  descricao       TEXT NOT NULL,                 -- ex: 'Assinatura 365 dias + 7 dias'
  total           NUMERIC(10,2) NOT NULL,
  quantidade_itens INT NOT NULL DEFAULT 1,

  -- Endereço de entrega/cobrança (opcional)
  endereco_id     UUID REFERENCES enderecos(id) ON DELETE SET NULL,

  criado_em       TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Itens detalhados do pedido
CREATE TABLE pedido_itens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id   UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  plano_id    UUID NOT NULL REFERENCES planos(id),
  descricao   TEXT NOT NULL,
  preco       NUMERIC(10,2) NOT NULL,
  criado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ÍNDICES
CREATE INDEX idx_pedidos_usuario      ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_status       ON pedidos(status);
CREATE INDEX idx_pedidos_codigo       ON pedidos(codigo);
CREATE INDEX idx_pedido_itens_pedido  ON pedido_itens(pedido_id);

-- ============================================================
-- SISTEMA DE QUESTÕES
-- ============================================================

-- ────────────────────────────────────────────────
-- NÍVEIS EDUCACIONAIS
-- ────────────────────────────────────────────────
CREATE TABLE niveis_educacionais (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome      VARCHAR(100) NOT NULL UNIQUE,   -- 'Ensino Médio', 'Ensino Superior', etc.
  ativo     BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- DIFICULDADES
-- ────────────────────────────────────────────────
CREATE TABLE dificuldades (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome      VARCHAR(50)  NOT NULL UNIQUE,   -- 'Muito Fácil', 'Fácil', 'Médio', 'Difícil', 'Muito Difícil'
  slug      VARCHAR(50)  NOT NULL UNIQUE,   -- 'muito_facil', 'facil', 'medio', 'dificil', 'muito_dificil'
  ativo     BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- BANCAS EXAMINADORAS
-- ────────────────────────────────────────────────
CREATE TABLE bancas (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome      VARCHAR(150) NOT NULL UNIQUE,   -- 'Cebraspe (CESPE)'
  sigla     VARCHAR(30)  NOT NULL UNIQUE,   -- 'CESPE', 'FCC', 'FGV', 'VUNESP'
  descricao TEXT,
  ativo     BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- CARREIRAS
-- ────────────────────────────────────────────────
CREATE TABLE carreiras (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome      VARCHAR(100) NOT NULL UNIQUE,   -- 'Policial', 'Tribunais', 'Fiscal', 'Administrativa'
  descricao TEXT,
  ativo     BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- CONCURSOS
-- ────────────────────────────────────────────────
CREATE TYPE status_concurso AS ENUM ('aberto', 'previsto', 'encerrado');

CREATE TABLE concursos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome            VARCHAR(255) NOT NULL,
  banca_id        UUID REFERENCES bancas(id) ON DELETE SET NULL,
  carreira_id     UUID REFERENCES carreiras(id) ON DELETE SET NULL,
  nivel_id        UUID REFERENCES niveis_educacionais(id) ON DELETE SET NULL,
  ano             SMALLINT,
  status          status_concurso NOT NULL DEFAULT 'previsto',
  ativo           BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- DISCIPLINAS
-- ────────────────────────────────────────────────
CREATE TABLE disciplinas (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code      VARCHAR(20)  NOT NULL UNIQUE,   -- 'DIR-ADM', 'POR'
  nome      VARCHAR(150) NOT NULL UNIQUE,
  descricao TEXT,
  ativo     BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- ASSUNTOS  (nível 1 dentro da disciplina)
-- ────────────────────────────────────────────────
CREATE TABLE assuntos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disciplina_id UUID NOT NULL REFERENCES disciplinas(id) ON DELETE CASCADE,
  nome          VARCHAR(200) NOT NULL,
  ativo         BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em     TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (disciplina_id, nome)
);

-- ────────────────────────────────────────────────
-- TÓPICOS  (nível 2)
-- ────────────────────────────────────────────────
CREATE TABLE topicos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assunto_id  UUID NOT NULL REFERENCES assuntos(id) ON DELETE CASCADE,
  nome        VARCHAR(200) NOT NULL,
  ativo       BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em   TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (assunto_id, nome)
);

-- ────────────────────────────────────────────────
-- SUBTÓPICOS  (nível 3)
-- ────────────────────────────────────────────────
CREATE TABLE subtopicos (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topico_id  UUID NOT NULL REFERENCES topicos(id) ON DELETE CASCADE,
  nome       VARCHAR(200) NOT NULL,
  ativo      BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em  TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (topico_id, nome)
);

-- ────────────────────────────────────────────────
-- TIPOS DE QUESTÃO
-- ────────────────────────────────────────────────
CREATE TABLE tipos_questao (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome      VARCHAR(100) NOT NULL UNIQUE,   -- 'Múltipla Escolha (A-E)', 'Certo ou Errado'
  slug      VARCHAR(50)  NOT NULL UNIQUE,   -- 'multiple_choice', 'true_false'
  ativo     BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- QUESTÕES
-- ────────────────────────────────────────────────
CREATE TYPE acesso_questao     AS ENUM ('premium');          -- todas as questões exigem assinatura
CREATE TYPE visibilidade_questao AS ENUM ('publica', 'privada', 'restrita');
CREATE TYPE status_questao     AS ENUM ('draft', 'published', 'archived', 'reported');

CREATE TABLE questoes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            VARCHAR(20)  NOT NULL UNIQUE,             -- 'QST-000002'

  -- Classificação
  disciplina_id   UUID REFERENCES disciplinas(id) ON DELETE SET NULL,
  assunto_id      UUID REFERENCES assuntos(id) ON DELETE SET NULL,
  topico_id       UUID REFERENCES topicos(id) ON DELETE SET NULL,
  subtopico_id    UUID REFERENCES subtopicos(id) ON DELETE SET NULL,
  banca_id        UUID REFERENCES bancas(id) ON DELETE SET NULL,
  concurso_id     UUID REFERENCES concursos(id) ON DELETE SET NULL,
  carreira_id     UUID REFERENCES carreiras(id) ON DELETE SET NULL,
  nivel_id        UUID REFERENCES niveis_educacionais(id) ON DELETE SET NULL,
  dificuldade_id  UUID REFERENCES dificuldades(id) ON DELETE SET NULL,
  tipo_id         UUID REFERENCES tipos_questao(id) ON DELETE SET NULL,

  -- Identificação extra
  instituicao     VARCHAR(150),                             -- 'TRT-15'
  ano             SMALLINT,                                 -- 2023
  is_inedita      BOOLEAN NOT NULL DEFAULT FALSE,           -- questão inédita

  -- Conteúdo
  enunciado       TEXT NOT NULL,                           -- questionText
  texto_apoio     TEXT,                                    -- supportText
  resolucao       TEXT,                                    -- resolution
  has_video       BOOLEAN NOT NULL DEFAULT FALSE,

  -- Controle
  acesso          acesso_questao     NOT NULL DEFAULT 'free',
  visibilidade    visibilidade_questao NOT NULL DEFAULT 'publica',
  status          status_questao     NOT NULL DEFAULT 'draft',

  -- Autoria
  autor_id        UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  revisor_id      UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  revisado_em     TIMESTAMP,

  -- Estatísticas (desnormalizadas para performance)
  total_respostas INT NOT NULL DEFAULT 0,
  taxa_acerto     NUMERIC(5,2) NOT NULL DEFAULT 0,         -- percentual 0-100
  tempo_medio_seg INT NOT NULL DEFAULT 0,
  total_comentarios INT NOT NULL DEFAULT 0,
  total_denuncias INT NOT NULL DEFAULT 0,

  criado_em       TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- ALTERNATIVAS
-- ────────────────────────────────────────────────
CREATE TABLE alternativas (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questao_id    UUID NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  letra         CHAR(1) NOT NULL,                          -- 'A', 'B', 'C', 'D', 'E'
  texto         TEXT NOT NULL,
  is_correta    BOOLEAN NOT NULL DEFAULT FALSE,
  percentual    NUMERIC(5,2),                              -- % de alunos que escolheu
  explicacao    TEXT,
  referencia    TEXT,
  dica          TEXT,
  UNIQUE (questao_id, letra)
);

-- ────────────────────────────────────────────────
-- METADADOS DA QUESTÃO (tags, palavras-chave, objetivos)
-- ────────────────────────────────────────────────
CREATE TABLE questao_tags (
  questao_id UUID NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  tag        VARCHAR(100) NOT NULL,
  PRIMARY KEY (questao_id, tag)
);

CREATE TABLE questao_keywords (
  questao_id UUID NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  keyword    VARCHAR(100) NOT NULL,
  PRIMARY KEY (questao_id, keyword)
);

CREATE TABLE questao_objetivos (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questao_id UUID NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  descricao  TEXT NOT NULL
);

CREATE TABLE questao_referencias (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questao_id UUID NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  texto      TEXT NOT NULL
);

CREATE TABLE questao_videos (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questao_id UUID NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  titulo     VARCHAR(200) NOT NULL,
  url        TEXT NOT NULL
);

-- ────────────────────────────────────────────────
-- RESPOSTAS DO USUÁRIO
-- ────────────────────────────────────────────────
CREATE TABLE respostas_usuarios (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id      UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  questao_id      UUID NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  alternativa_id  UUID REFERENCES alternativas(id) ON DELETE SET NULL,
  is_correta      BOOLEAN NOT NULL,
  tempo_seg       INT,                                     -- tempo gasto em segundos
  respondido_em   TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, questao_id)                         -- 1 resposta por questão
);

-- ────────────────────────────────────────────────
-- FAVORITOS & CADERNO DE QUESTÕES
-- ────────────────────────────────────────────────
CREATE TABLE favoritos (
  usuario_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  questao_id  UUID NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  criado_em   TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (usuario_id, questao_id)
);

-- ────────────────────────────────────────────────
-- ÍNDICES — QUESTÕES
-- ────────────────────────────────────────────────
CREATE INDEX idx_questoes_disciplina    ON questoes(disciplina_id);
CREATE INDEX idx_questoes_banca         ON questoes(banca_id);
CREATE INDEX idx_questoes_status        ON questoes(status);
CREATE INDEX idx_questoes_acesso        ON questoes(acesso);
CREATE INDEX idx_questoes_dificuldade   ON questoes(dificuldade_id);
CREATE INDEX idx_questoes_ano           ON questoes(ano);
CREATE INDEX idx_alternativas_questao   ON alternativas(questao_id);
CREATE INDEX idx_respostas_usuario      ON respostas_usuarios(usuario_id);
CREATE INDEX idx_respostas_questao      ON respostas_usuarios(questao_id);
CREATE INDEX idx_favoritos_usuario      ON favoritos(usuario_id);


-- ============================================================
-- COMENTÁRIOS NAS QUESTÕES
-- ============================================================
CREATE TABLE comentarios (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questao_id      UUID NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  usuario_id      UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  parent_id       UUID REFERENCES comentarios(id) ON DELETE CASCADE,  -- resposta a outro comentário
  texto           TEXT NOT NULL,
  total_curtidas  INT NOT NULL DEFAULT 0,
  is_professor    BOOLEAN NOT NULL DEFAULT FALSE,  -- destaque para comentário de professor
  editado         BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em       TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE comentario_curtidas (
  usuario_id    UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  comentario_id UUID NOT NULL REFERENCES comentarios(id) ON DELETE CASCADE,
  criado_em     TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (usuario_id, comentario_id)
);

-- ============================================================
-- DENÚNCIAS NAS QUESTÕES
-- ============================================================
CREATE TYPE status_denuncia AS ENUM ('pendente', 'em_analise', 'resolvida', 'ignorada');
CREATE TYPE motivo_denuncia AS ENUM (
  'gabarito_errado',
  'enunciado_errado',
  'alternativa_errada',
  'questao_desatualizada',
  'conteudo_inapropriado',
  'outro'
);

CREATE TABLE denuncias (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questao_id    UUID NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  usuario_id    UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  motivo        motivo_denuncia NOT NULL,
  descricao     TEXT,
  status        status_denuncia NOT NULL DEFAULT 'pendente',
  resolvido_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  resolvido_em  TIMESTAMP,
  criado_em     TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (questao_id, usuario_id)  -- 1 denúncia por usuário por questão
);

-- ============================================================
-- CADERNOS DE QUESTÕES
-- ============================================================
CREATE TYPE visibilidade_caderno AS ENUM ('privado', 'publico');

CREATE TABLE cadernos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id    UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nome          VARCHAR(200) NOT NULL,
  descricao     TEXT,
  visibilidade  visibilidade_caderno NOT NULL DEFAULT 'privado',
  capa_url      TEXT,
  criado_em     TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE caderno_questoes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caderno_id  UUID NOT NULL REFERENCES cadernos(id) ON DELETE CASCADE,
  questao_id  UUID NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  ordem       INT NOT NULL DEFAULT 0,
  anotacao    TEXT,   -- nota específica do aluno para essa questão no caderno
  adicionado_em TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (caderno_id, questao_id)
);

-- ============================================================
-- RANKINGS
-- ============================================================
CREATE TYPE periodo_ranking AS ENUM ('semanal', 'mensal', 'geral');

CREATE TABLE rankings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id      UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  carreira_id     UUID REFERENCES carreiras(id) ON DELETE SET NULL,  -- NULL = ranking geral
  periodo         periodo_ranking NOT NULL DEFAULT 'geral',
  pontuacao       INT NOT NULL DEFAULT 0,
  posicao         INT,                  -- calculado periodicamente
  total_questoes  INT NOT NULL DEFAULT 0,
  taxa_acerto     NUMERIC(5,2) NOT NULL DEFAULT 0,
  referencia_em   DATE NOT NULL,        -- semana ou mês de referência
  atualizado_em   TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, carreira_id, periodo, referencia_em)
);

-- ============================================================
-- REVISÕES — REPETIÇÃO ESPAÇADA
-- ============================================================
CREATE TYPE status_revisao AS ENUM ('pendente', 'revisada', 'adiada');

CREATE TABLE revisoes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id      UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  questao_id      UUID NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  status          status_revisao NOT NULL DEFAULT 'pendente',
  -- Algoritmo de repetição espaçada (SM-2 simplificado)
  intervalo_dias  INT NOT NULL DEFAULT 1,  -- próxima revisão em X dias
  facilidade      NUMERIC(4,2) NOT NULL DEFAULT 2.5,  -- fator de facilidade
  repeticoes      INT NOT NULL DEFAULT 0,
  proxima_revisao DATE NOT NULL DEFAULT CURRENT_DATE + INTERVAL '1 day',
  ultima_revisao  TIMESTAMP,
  criado_em       TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, questao_id)
);

-- ============================================================
-- ANOTAÇÕES NAS QUESTÕES
-- ============================================================
CREATE TABLE anotacoes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  questao_id  UUID NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  texto       TEXT NOT NULL,
  cor         VARCHAR(20) NOT NULL DEFAULT 'yellow',  -- cor do destaque/nota
  criado_em   TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, questao_id)  -- 1 anotação por questão por usuário
);

-- ============================================================
-- SUPORTE / TICKETS
-- ============================================================
CREATE TYPE status_ticket    AS ENUM ('aberto', 'em_atendimento', 'aguardando_usuario', 'resolvido', 'fechado');
CREATE TYPE prioridade_ticket AS ENUM ('baixa', 'media', 'alta', 'urgente');
CREATE TYPE categoria_ticket  AS ENUM ('financeiro', 'tecnico', 'conteudo', 'conta', 'outro');

CREATE TABLE tickets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo          VARCHAR(20) NOT NULL UNIQUE,           -- ex: #TKT-00123
  usuario_id      UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  atendente_id    UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  categoria       categoria_ticket  NOT NULL DEFAULT 'outro',
  prioridade      prioridade_ticket NOT NULL DEFAULT 'media',
  status          status_ticket     NOT NULL DEFAULT 'aberto',
  assunto         VARCHAR(255) NOT NULL,
  criado_em       TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em   TIMESTAMP NOT NULL DEFAULT NOW(),
  fechado_em      TIMESTAMP
);

CREATE TABLE ticket_mensagens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id   UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  usuario_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  texto       TEXT NOT NULL,
  is_interno  BOOLEAN NOT NULL DEFAULT FALSE,  -- nota interna (só admins veem)
  criado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE ticket_anexos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mensagem_id UUID NOT NULL REFERENCES ticket_mensagens(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  nome        VARCHAR(255),
  criado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ESTATÍSTICAS CONSOLIDADAS (cache de performance)
-- ============================================================
-- Atualizado por job periódico — evita recalcular em tempo real

CREATE TABLE estatisticas_usuario (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id          UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  disciplina_id       UUID REFERENCES disciplinas(id) ON DELETE CASCADE,  -- NULL = geral
  -- Totais
  total_questoes      INT NOT NULL DEFAULT 0,
  total_corretas      INT NOT NULL DEFAULT 0,
  total_erradas       INT NOT NULL DEFAULT 0,
  taxa_acerto         NUMERIC(5,2) NOT NULL DEFAULT 0,
  tempo_total_seg     INT NOT NULL DEFAULT 0,
  tempo_medio_seg     INT NOT NULL DEFAULT 0,
  -- Sequências
  sequencia_atual     INT NOT NULL DEFAULT 0,   -- dias consecutivos estudando
  maior_sequencia     INT NOT NULL DEFAULT 0,
  -- Período de referência
  referencia_inicio   DATE NOT NULL DEFAULT CURRENT_DATE,
  referencia_fim      DATE,
  atualizado_em       TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, disciplina_id, referencia_inicio)
);

-- ============================================================
-- ÍNDICES — MÓDULOS COMPLEMENTARES
-- ============================================================
CREATE INDEX idx_comentarios_questao       ON comentarios(questao_id);
CREATE INDEX idx_comentarios_usuario       ON comentarios(usuario_id);
CREATE INDEX idx_comentarios_parent        ON comentarios(parent_id);
CREATE INDEX idx_denuncias_questao         ON denuncias(questao_id);
CREATE INDEX idx_denuncias_status          ON denuncias(status);
CREATE INDEX idx_cadernos_usuario          ON cadernos(usuario_id);
CREATE INDEX idx_caderno_questoes_caderno  ON caderno_questoes(caderno_id);
CREATE INDEX idx_rankings_usuario          ON rankings(usuario_id);
CREATE INDEX idx_rankings_periodo          ON rankings(periodo, referencia_em);
CREATE INDEX idx_rankings_carreira         ON rankings(carreira_id);
CREATE INDEX idx_revisoes_usuario          ON revisoes(usuario_id);
CREATE INDEX idx_revisoes_proxima          ON revisoes(usuario_id, proxima_revisao);
CREATE INDEX idx_anotacoes_usuario         ON anotacoes(usuario_id);
CREATE INDEX idx_tickets_usuario           ON tickets(usuario_id);
CREATE INDEX idx_tickets_status            ON tickets(status);
CREATE INDEX idx_ticket_mensagens_ticket   ON ticket_mensagens(ticket_id);
CREATE INDEX idx_estatisticas_usuario      ON estatisticas_usuario(usuario_id);
CREATE INDEX idx_estatisticas_disciplina   ON estatisticas_usuario(disciplina_id);


-- ============================================================
-- PAGAMENTOS / TRANSAÇÕES
-- ============================================================
CREATE TYPE metodo_pagamento  AS ENUM ('cartao_credito', 'cartao_debito', 'pix', 'boleto');
CREATE TYPE status_pagamento  AS ENUM ('pendente', 'aprovado', 'recusado', 'reembolsado', 'cancelado', 'expirado');

CREATE TABLE pagamentos (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id           UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  usuario_id          UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,

  -- Gateway
  gateway             VARCHAR(50) NOT NULL,          -- 'stripe', 'mercadopago', 'pagseguro'
  gateway_id          VARCHAR(255) UNIQUE,           -- ID da transação no gateway
  gateway_payload     JSONB,                         -- resposta bruta do gateway

  -- Dados da cobrança
  metodo              metodo_pagamento NOT NULL,
  valor               NUMERIC(10,2) NOT NULL,
  valor_reembolsado   NUMERIC(10,2) NOT NULL DEFAULT 0,
  moeda               CHAR(3) NOT NULL DEFAULT 'BRL',
  parcelas            SMALLINT NOT NULL DEFAULT 1,

  -- Status
  status              status_pagamento NOT NULL DEFAULT 'pendente',
  aprovado_em         TIMESTAMP,
  reembolsado_em      TIMESTAMP,

  -- Cartão (dados mascarados)
  cartao_bandeira     VARCHAR(20),                   -- 'visa', 'mastercard'
  cartao_final        CHAR(4),                       -- últimos 4 dígitos

  criado_em           TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- NOTIFICAÇÕES
-- ============================================================
CREATE TYPE tipo_notificacao AS ENUM (
  'ranking_posicao',
  'revisao_pendente',
  'ticket_resposta',
  'assinatura_vencendo',
  'assinatura_vencida',
  'questao_comentario',
  'conquista',
  'sistema'
);

CREATE TABLE notificacoes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo        tipo_notificacao NOT NULL,
  titulo      VARCHAR(200) NOT NULL,
  mensagem    TEXT NOT NULL,
  link        TEXT,                        -- URL de destino ao clicar
  lida        BOOLEAN NOT NULL DEFAULT FALSE,
  lida_em     TIMESTAMP,
  criado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- LOG DE AUDITORIA
-- ============================================================
CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id  UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  acao        VARCHAR(100) NOT NULL,       -- 'questao.create', 'usuario.ban', 'plano.update'
  tabela      VARCHAR(100),               -- tabela afetada
  registro_id UUID,                       -- id do registro afetado
  dados_antes JSONB,                      -- snapshot antes da alteração
  dados_depois JSONB,                     -- snapshot após a alteração
  ip_address  VARCHAR(45),
  user_agent  TEXT,
  criado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SIMULADOS
-- ============================================================
CREATE TYPE status_simulado      AS ENUM ('draft', 'published', 'archived');
CREATE TYPE visibilidade_simulado AS ENUM ('privado', 'publico');

CREATE TABLE simulados (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  criador_id        UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,

  titulo            VARCHAR(255) NOT NULL,
  descricao         TEXT,
  instrucoes        TEXT,                        -- texto de instrução exibido antes de iniciar

  -- Configurações de tempo
  tempo_limite_min  INT,                         -- NULL = sem limite
  -- Configurações de exibição
  embaralhar_questoes BOOLEAN NOT NULL DEFAULT FALSE,
  embaralhar_alternativas BOOLEAN NOT NULL DEFAULT FALSE,
  gabarito_ao_final BOOLEAN NOT NULL DEFAULT TRUE,  -- só libera gabarito ao terminar

  -- Classificação
  carreira_id       UUID REFERENCES carreiras(id) ON DELETE SET NULL,
  concurso_id       UUID REFERENCES concursos(id) ON DELETE SET NULL,

  status            status_simulado      NOT NULL DEFAULT 'draft',
  visibilidade      visibilidade_simulado NOT NULL DEFAULT 'privado',

  criado_em         TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em     TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Questões dentro do simulado (ordenadas)
CREATE TABLE simulado_questoes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  simulado_id UUID NOT NULL REFERENCES simulados(id) ON DELETE CASCADE,
  questao_id  UUID NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  ordem       INT NOT NULL DEFAULT 0,
  peso        NUMERIC(4,2) NOT NULL DEFAULT 1.0,  -- peso na pontuação final
  UNIQUE (simulado_id, questao_id)
);

-- Tentativas do aluno no simulado
CREATE TYPE status_tentativa AS ENUM ('em_andamento', 'concluida', 'abandonada', 'tempo_esgotado');

CREATE TABLE simulado_tentativas (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  simulado_id   UUID NOT NULL REFERENCES simulados(id) ON DELETE CASCADE,
  usuario_id    UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  status        status_tentativa NOT NULL DEFAULT 'em_andamento',
  pontuacao     NUMERIC(8,2),
  total_corretas INT,
  total_erradas  INT,
  tempo_gasto_seg INT,
  iniciado_em   TIMESTAMP NOT NULL DEFAULT NOW(),
  finalizado_em TIMESTAMP
);

-- Respostas da tentativa por questão
CREATE TABLE simulado_respostas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tentativa_id    UUID NOT NULL REFERENCES simulado_tentativas(id) ON DELETE CASCADE,
  questao_id      UUID NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  alternativa_id  UUID REFERENCES alternativas(id) ON DELETE SET NULL,
  is_correta      BOOLEAN,
  tempo_seg       INT,
  respondido_em   TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (tentativa_id, questao_id)
);

-- ============================================================
-- CONFIGURAÇÕES DO SISTEMA
-- ============================================================
CREATE TABLE configuracoes (
  chave       VARCHAR(100) PRIMARY KEY,
  valor       TEXT NOT NULL,
  descricao   TEXT,
  tipo        VARCHAR(20) NOT NULL DEFAULT 'string',  -- 'string', 'integer', 'boolean', 'json'
  editavel    BOOLEAN NOT NULL DEFAULT TRUE,
  atualizado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  atualizado_em  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Valores padrão do sistema
INSERT INTO configuracoes (chave, valor, tipo, descricao) VALUES
  ('ranking.pontos_por_acerto',        '10',    'integer', 'Pontos ganhos por questão correta no ranking'),
  ('ranking.pontos_por_erro',          '-2',    'integer', 'Pontos perdidos por questão errada'),
  ('ranking.atualizacao_horas',        '1',     'integer', 'Intervalo em horas para recalcular posições'),
  ('simulado.max_questoes',            '120',   'integer', 'Número máximo de questões por simulado'),
  ('questao.tempo_max_seg',            '600',   'integer', 'Tempo máximo por questão em segundos'),
  ('revisao.intervalo_minimo_dias',    '1',     'integer', 'Intervalo mínimo entre revisões (dias)'),
  ('notificacao.revisao_antecedencia', '1',     'integer', 'Dias de antecedência para notificar revisão pendente'),
  ('assinatura.aviso_vencimento_dias', '7',     'integer', 'Dias antes do vencimento para notificar usuário'),
  ('suporte.sla_resposta_horas',       '24',    'integer', 'SLA de resposta do suporte em horas');

-- ============================================================
-- ÍNDICES — MÓDULOS FINAIS
-- ============================================================
CREATE INDEX idx_pagamentos_pedido       ON pagamentos(pedido_id);
CREATE INDEX idx_pagamentos_usuario      ON pagamentos(usuario_id);
CREATE INDEX idx_pagamentos_status       ON pagamentos(status);
CREATE INDEX idx_pagamentos_gateway_id   ON pagamentos(gateway_id);
CREATE INDEX idx_notificacoes_usuario    ON notificacoes(usuario_id);
CREATE INDEX idx_notificacoes_lida       ON notificacoes(usuario_id, lida);
CREATE INDEX idx_audit_usuario           ON audit_logs(usuario_id);
CREATE INDEX idx_audit_tabela            ON audit_logs(tabela, registro_id);
CREATE INDEX idx_audit_criado            ON audit_logs(criado_em);
CREATE INDEX idx_simulados_criador       ON simulados(criador_id);
CREATE INDEX idx_simulados_status        ON simulados(status);
CREATE INDEX idx_simulado_questoes       ON simulado_questoes(simulado_id);
CREATE INDEX idx_simulado_tentativas_usr ON simulado_tentativas(usuario_id);
CREATE INDEX idx_simulado_tentativas_sim ON simulado_tentativas(simulado_id);
CREATE INDEX idx_simulado_respostas      ON simulado_respostas(tentativa_id);



