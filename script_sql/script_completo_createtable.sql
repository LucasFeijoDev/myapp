-- Tabela de Usuários
CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    perfil TEXT NOT NULL CHECK (perfil IN ('admin', 'gestor', 'colaborador'))
);

-- Tabela de Habilidades
CREATE TABLE habilidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    descricao TEXT
);

-- Tabela de Relacionamento Usuário-Habilidade (N:N)
CREATE TABLE usuario_habilidade (
    usuario_id INTEGER,
    habilidade_id INTEGER,
    PRIMARY KEY (usuario_id, habilidade_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (habilidade_id) REFERENCES habilidades(id) ON DELETE CASCADE
);

-- Tabela de Tarefas
CREATE TABLE tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT,
    status TEXT DEFAULT 'pendente' CHECK(status IN ('pendente', 'em_andamento', 'concluida')),
    usuario_id INTEGER,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabela de Vagas
CREATE TABLE vagas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT,
    habilidades_necessarias TEXT -- lista de IDs separados por vírgula
);

-- Índices para melhor performance
CREATE INDEX idx_usuario_habilidade_usuario ON usuario_habilidade(usuario_id);
CREATE INDEX idx_usuario_habilidade_habilidade ON usuario_habilidade(habilidade_id);
CREATE INDEX idx_tarefas_usuario ON tarefas(usuario_id);
CREATE INDEX idx_tarefas_status ON tarefas(status);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_perfil ON usuarios(perfil);