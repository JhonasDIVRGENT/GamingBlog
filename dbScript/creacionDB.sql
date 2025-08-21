-- Crear la base de datos
CREATE DATABASE GamingBlog;
GO

USE GamingBlog;
GO

-- Tabla de Usuarios
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) DEFAULT 'user' -- 'user' o 'admin'
);
GO

-- Tabla de Publicaciones
CREATE TABLE Posts (
    PostID INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(100) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UserID INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
GO

-- Tabla de Comentarios
CREATE TABLE Comments (
    CommentID INT IDENTITY(1,1) PRIMARY KEY,
    Content NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UserID INT NOT NULL,
    PostID INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (PostID) REFERENCES Posts(PostID)
);
GO

-- Insertar datos de prueba en Usuarios
INSERT INTO Users (Username, Email, Password, Role)
VALUES 
('admin', 'admin@gamingblog.com', 'admin123', 'admin'),
('user1', 'user1@gamingblog.com', 'password1', 'user'),
('user2', 'user2@gamingblog.com', 'password2', 'user');
GO

-- Insertar datos de prueba en Publicaciones
INSERT INTO Posts (Title, Content, UserID)
VALUES 
('Welcome to Gaming Blog', 'This is the first post on our gaming blog!', 1),
('Top 10 Games of 2025', 'Here are the top 10 games you must play this year.', 2),
('Gaming Tips for Beginners', 'Learn how to get started with gaming.', 3);
GO

-- Insertar datos de prueba en Comentarios
INSERT INTO Comments (Content, UserID, PostID)
VALUES 
('Great post! Looking forward to more content.', 2, 1),
('I totally agree with this list!', 3, 2),
('Thanks for the tips!', 1, 3);
GO