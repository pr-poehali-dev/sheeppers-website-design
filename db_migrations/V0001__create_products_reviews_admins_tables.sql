CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL,
    image TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    author_name VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, price, category, image, description) VALUES
('Толстовка Premium', 4990, 'men', 'https://cdn.poehali.dev/projects/3c11bd7a-d1bb-4831-94b5-9dcc4b142192/files/b4bccb5a-0eb3-4eff-93bb-792652e92317.jpg', 'Комфортная толстовка премиум качества'),
('Худи Comfort', 3990, 'women', 'https://cdn.poehali.dev/projects/3c11bd7a-d1bb-4831-94b5-9dcc4b142192/files/65178f56-1b3a-48d6-bc99-340a0ecad011.jpg', 'Удобная худи для повседневной носки'),
('Свитшот Kids', 2990, 'kids', 'https://cdn.poehali.dev/projects/3c11bd7a-d1bb-4831-94b5-9dcc4b142192/files/b4bccb5a-0eb3-4eff-93bb-792652e92317.jpg', 'Мягкий свитшот для детей'),
('Парные худи Love', 8990, 'couples', 'https://cdn.poehali.dev/projects/3c11bd7a-d1bb-4831-94b5-9dcc4b142192/files/b4bccb5a-0eb3-4eff-93bb-792652e92317.jpg', 'Стильный комплект для пар'),
('Толстовка Classic', 4490, 'men', 'https://cdn.poehali.dev/projects/3c11bd7a-d1bb-4831-94b5-9dcc4b142192/files/65178f56-1b3a-48d6-bc99-340a0ecad011.jpg', 'Классическая модель толстовки'),
('Худи Elegant', 4290, 'women', 'https://cdn.poehali.dev/projects/3c11bd7a-d1bb-4831-94b5-9dcc4b142192/files/b4bccb5a-0eb3-4eff-93bb-792652e92317.jpg', 'Элегантная худи для женщин');

INSERT INTO reviews (product_id, author_name, rating, comment) VALUES
(1, 'Анна Смирнова', 5, 'Отличная толстовка! Очень приятная к телу, качество на высоте'),
(1, 'Дмитрий Петров', 4, 'Хорошая вещь, но размер маломерит немного'),
(2, 'Елена Иванова', 5, 'Просто влюбилась в эту худи! Ношу не снимая'),
(4, 'Максим и Ольга', 5, 'Купили парные худи - очень довольны! Выглядят стильно');