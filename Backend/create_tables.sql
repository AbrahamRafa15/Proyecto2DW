CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    titulo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE posts ( 
    id SERIAL PRIMARY KEY,
    autor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    autor TEXT,
    fecha TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    contenido TEXT,
    image_id INTEGER REFERENCES images(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_posts_fecha ON posts(fecha DESC);