CREATE TABLE login (
    loginid integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username varchar(100) NOT NULL UNIQUE,
    passwordhash text NOT NULL,
    removido boolean NOT NULL DEFAULT false
);

CREATE TABLE pasto (
    pastoid integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descricao varchar(255) NOT NULL,
    areatotal numeric NOT NULL,
    removido boolean NOT NULL DEFAULT false
);

CREATE TABLE piquete (
    piqueteid integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descricao varchar(255) NOT NULL,
    latitude numeric NOT NULL,
    longitude numeric NOT NULL,
    pastoidfk integer NOT NULL REFERENCES pasto(pastoid),
    areausada numeric CHECK (areausada > 0 AND areausada < 'Infinity'::numeric),
    removido boolean NOT NULL DEFAULT false
);

CREATE TABLE animal (
    animalid integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome varchar(255) NOT NULL,
    datanasc date NOT NULL,
    removido boolean NOT NULL DEFAULT false
);

CREATE TABLE alocado (
    alocadoid integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    animalidifk integer NOT NULL REFERENCES animal(animalid),
    piqueteidfk integer NOT NULL REFERENCES piquete(piqueteid),
    datainicio date NOT NULL,
    datafinal date NOT NULL,
    removido boolean NOT NULL DEFAULT false
);
