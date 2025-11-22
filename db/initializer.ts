import { type SQLiteDatabase } from "expo-sqlite";

export async function initializer(db: SQLiteDatabase) {
  await db.execAsync(`

        CREATE TABLE IF NOT EXISTS category (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS category_column (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category_id INTEGER NOT NULL,
            FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS category_registry (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL,
            description TEXT,
            category_id INTEGER NOT NULL,
            FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS category_registry_column_junction (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            value_text TEXT NOT NULL,
            href TEXT,
            isActive INTEGER,
            category_column_id INTEGER NOT NULL,
            category_registry_id INTEGER NOT NULL,
            FOREIGN KEY (category_column_id) REFERENCES category_column(id) ON DELETE CASCADE,
            FOREIGN KEY (category_registry_id) REFERENCES category_registry(id)ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS user_preferences (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         primary_color_header TEXT NOT NULL,
         secondary_color_header TEXT NOT NULL,
         primary_color TEXT NOT NULL,
         secondary_color TEXT NOT NULL,
         column_min_width INTEGER NOT NULL,
         column_min_heigth INTEGER NOT NULL
        );

        INSERT INTO user_preferences(primary_color_header, secondary_color_header, primary_color,secondary_color, column_min_width, column_min_heigth)
                                    VALUES('#3b82f6', '#2563eb', '#d1d5db', '#9ca3af', 60, 60);

  `);
}

/*
 INSERT INTO category (name)
        SELECT 'Eletronicos'
        UNION ALL SELECT 'Esporte'
        UNION ALL SELECT 'Lazer'
        WHERE NOT EXISTS (SELECT 1 FROM category);


      INSERT INTO category_column (name, category_id)
        SELECT 'voltagem',   (SELECT id FROM category WHERE name='Eletronicos')
        UNION ALL
        SELECT 'clube',      (SELECT id FROM category WHERE name='Esporte')
        UNION ALL
        SELECT 'satisfação', (SELECT id FROM category WHERE name='Lazer')
        WHERE NOT EXISTS (SELECT 1 FROM category_column);

       
        INSERT INTO category_registry (name, price, description, category_id)
        SELECT 'geladeira', 1000.00, 'geladeira de teste',
            (SELECT id FROM category WHERE name='Eletronicos')
        UNION ALL
        SELECT 'playstation', 2500.00, 'playstation de teste',
            (SELECT id FROM category WHERE name='Eletronicos')
        UNION ALL
        SELECT 'torradeira', 50.00, 'torradeira de teste',
            (SELECT id FROM category WHERE name='Eletronicos')
        UNION ALL
        SELECT 'camisa', 100.00, 'camisa de teste',
            (SELECT id FROM category WHERE name='Esporte')
        UNION ALL
        SELECT 'calça', 250.00, 'calça de teste',
            (SELECT id FROM category WHERE name='Esporte')
        UNION ALL
        SELECT 'blusa', 50.00, 'blusa de teste',
            (SELECT id FROM category WHERE name='Esporte')
        WHERE NOT EXISTS (SELECT 1 FROM category_registry);
        

        INSERT INTO category_registry_column_junction (value_text, category_column_id, category_registry_id)
        SELECT '110',
            (SELECT id FROM category_column WHERE name='voltagem'),
            (SELECT id FROM category_registry WHERE name='geladeira')
        UNION ALL
        SELECT '220',
            (SELECT id FROM category_column WHERE name='voltagem'),
            (SELECT id FROM category_registry WHERE name='playstation')
        UNION ALL
        SELECT '110',
            (SELECT id FROM category_column WHERE name='voltagem'),
            (SELECT id FROM category_registry WHERE name='torradeira')
        UNION ALL
        SELECT 'Gremio',
            (SELECT id FROM category_column WHERE name='clube'),
            (SELECT id FROM category_registry WHERE name='camisa')
        UNION ALL
        SELECT 'Inter',
            (SELECT id FROM category_column WHERE name='clube'),
            (SELECT id FROM category_registry WHERE name='calça')
        UNION ALL
        SELECT 'Juventude',
            (SELECT id FROM category_column WHERE name='clube'),
            (SELECT id FROM category_registry WHERE name='blusa')
        WHERE NOT EXISTS (SELECT 1 FROM category_registry_column_junction);
*/
