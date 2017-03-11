DROP DATABASE IF EXISTS dbatime;

CREATE DATABASE IF NOT EXISTS dbatime CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE dbatime;

CREATE TABLE IF NOT EXISTS torcedor (
  codigo_torcedor INTEGER UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK',
  nome VARCHAR(35) NOT NULL COMMENT 'nome do torcedor',
  login VARCHAR(20) NOT NULL UNIQUE COMMENT 'login do torcedor',
  email VARCHAR(100) NOT NULL UNIQUE COMMENT 'email do torcedor',
  senha CHAR(128) NOT NULL COMMENT 'senha do torcedor',
  token CHAR(64) NULL COMMENT 'token de autenticacao do torcedor',
  otpsecret CHAR(16) NULL COMMENT 'Armazena a chave de autenticacao de 2 fatores do google autenticator',
  otpativado TINYINT(1) DEFAULT 0 NULL COMMENT 'flag que indica que autenticacao de 2 fatores foi ativada',
  PRIMARY KEY(codigo_torcedor) 
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT 'tabela que armazena os torcedores';

CREATE TABLE IF NOT EXISTS tecnico (
  codigo_tecnico INTEGER UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK',
  nome VARCHAR(30) NOT NULL COMMENT 'nome do tecnico',
  data_nascimento DATE NOT NULL COMMENT 'data de nascimento',
  PRIMARY KEY(codigo_tecnico)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT 'tabela que armazena os tecnicos';

CREATE TABLE IF NOT EXISTS categoria (
  codigo_categoria INTEGER UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK',
  nome VARCHAR(30) NOT NULL UNIQUE COMMENT 'nome da categoria',
  PRIMARY KEY(codigo_categoria) 
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT 'tabela que armazena os categorias';

CREATE TABLE IF NOT EXISTS divisao (
  codigo_divisao INTEGER UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK',
  nome VARCHAR(25) NOT NULL UNIQUE COMMENT 'nome da divisao',
  PRIMARY KEY(codigo_divisao) 
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT 'tabela que armazena as divisoes';

CREATE TABLE IF NOT EXISTS time (
  codigo_time INTEGER UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK',
  nome VARCHAR(35) NOT NULL COMMENT 'nome da time',
  tecnico_codigo_tecnico INTEGER UNSIGNED NOT NULL COMMENT 'FK de tecnico',  
  categoria_codigo_categoria INTEGER UNSIGNED NOT NULL COMMENT 'FK de categoria',
  divisao_codigo_divisao INTEGER UNSIGNED NOT NULL COMMENT 'FK de divisao',
  desempenho_time  TINYINT(1) NULL COMMENT 'desempenho do time',
  comprar_novo_jogador  TINYINT(1) NULL COMMENT 'comprar novo jogador para o time',
  capa VARCHAR(100) NULL COMMENT 'capa do time',
  PRIMARY KEY(codigo_time)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT 'tabela que armazena os times';

CREATE INDEX idx_Login ON torcedor(login);
CREATE INDEX idx_fk_TimeTecnico ON time(tecnico_codigo_tecnico);
CREATE INDEX idx_fk_TimeCategoria ON time(categoria_codigo_categoria);
CREATE INDEX idx_fk_TimeDivisao ON time(divisao_codigo_divisao);

ALTER TABLE time
ADD CONSTRAINT fk_TimeTecnico
FOREIGN KEY(tecnico_codigo_tecnico)
REFERENCES tecnico(codigo_tecnico)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE time
ADD CONSTRAINT fk_TimeDivisao
FOREIGN KEY(divisao_codigo_divisao)
REFERENCES divisao(codigo_divisao)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE time ADD
CONSTRAINT fk_TimeCategoria
FOREIGN KEY(categoria_codigo_categoria)
REFERENCES categoria(codigo_categoria)
ON DELETE NO ACTION
ON UPDATE NO ACTION;
