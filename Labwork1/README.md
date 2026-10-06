# Labwork1 — StudyGroup Management System

Веб-приложение для управления коллекцией StudyGroup с PostgreSQL и React.

## Стек

- Java 17
- Spring MVC 7
- EclipseLink / JPA
- PostgreSQL
- React 19 + Redux Toolkit
- Material UI
- Maven
- Docker Compose
- Server-Sent Events (SSE)

## Архитектура

Backend разделён на уровни:

controller → service → repository → JPA/EclipseLink → PostgreSQL

Frontend состоит из React-компонентов и Redux store. Основные операции с StudyGroup выполняются на сервере.

## Запуск

### 1. Переменные окружения

Скопируйте .env.example в .env и укажите свои значения:

    DB_NAME=studs
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_URL=jdbc:postgresql://pg:5432/studs

Файл .env не должен попадать в Git.

### 2. Сборка backend

Из каталога Labwork1:

    mvn clean package

После сборки должен появиться:

    target/study-group-service-1.0-SNAPSHOT.war

### 3. Запуск PostgreSQL и WildFly

    docker compose up -d

Backend будет доступен на http://localhost:8080.

### 4. Запуск frontend

Из каталога Labwork1/frontend:

    npm install
    npm run dev

Frontend обычно будет доступен на http://localhost:5173.

## Основные API

StudyGroup:

- POST /api/study-groups — создание
- GET /api/study-groups/{id} — получение по ID
- GET /api/study-groups — таблица с фильтрацией, сортировкой и пагинацией
- PUT /api/study-groups/{id} — изменение
- DELETE /api/study-groups/{id} — удаление

Специальные операции:

- GET /api/study-groups/special/count-by-admin/{adminId}
- GET /api/study-groups/special/count-should-be-expelled-greater?value=...
- GET /api/study-groups/special/admin-less-than/{adminId}
- POST /api/study-groups/{id}/expel-all
- POST /api/study-groups/transfer?sourceId=...&targetId=...

Синхронизация:

Frontend открывает SSE-соединение к /api/stream. После изменения данных backend отправляет событие, а клиенты автоматически загружают актуальные коллекции.

## Валидация и ограничения

Валидация выполняется на уровне Bean Validation и дополнительно поддерживается ограничениями PostgreSQL.

ID генерируется базой данных. creationDate создаётся автоматически при сохранении объекта.

Удаление администратора, связанного с StudyGroup, запрещается и сопровождается понятным сообщением.

## Важно

В репозитории уже существовала история с секретом PostgreSQL. Даже после удаления пароля из текущих файлов старый секрет может оставаться в Git history, поэтому реальный пароль следует сменить.
