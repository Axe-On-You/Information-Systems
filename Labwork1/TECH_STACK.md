# Labwork1 — технологии и описание реализации

Веб-приложение для управления коллекцией `StudyGroup`.

## Стек

- Java 17
- Spring MVC 7
- EclipseLink / JPA
- PostgreSQL
- React 19
- Redux Toolkit
- Material UI
- Maven
- Docker Compose
- Server-Sent Events (SSE)

## Архитектура

Backend разделён на уровни:

```text
controller → service → repository → JPA/EclipseLink → PostgreSQL
```

Frontend состоит из React-компонентов и Redux store.

Основные операции с `StudyGroup` выполняются на серверной части. Специальные операции также реализованы в бизнес-логике приложения, без использования функций и процедур PostgreSQL.

## Backend

Основные части backend:

- `controller` — REST-контроллеры и обработчики HTTP-запросов;
- `service` — бизнес-логика;
- `repository` — работа с данными;
- `model` — JPA-сущности и перечисления;
- `config` — конфигурация Spring, JPA и приложения.

Используется Spring MVC.

Для уровня хранения используется EclipseLink / JPA.

Подключение к PostgreSQL выполняется через переменные окружения:

```text
DB_NAME
DB_USER
DB_PASSWORD
DB_URL
```

Пароль БД не должен находиться в исходном коде или попадать в Git.

## Frontend

Frontend находится в каталоге `frontend`.

Используются:

- React;
- Redux Toolkit;
- Material UI;
- Axios.

Запуск:

```bash
cd frontend
npm install
npm run dev
```

Frontend обычно доступен на:

```text
http://localhost:5173
```

## Запуск через Docker

Из каталога `Labwork1`:

```bash
docker compose up -d
```

Перед запуском необходимо создать `.env` на основе `.env.example`.

Пример:

```env
DB_NAME=studs
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_URL=jdbc:postgresql://pg:5432/studs
```

После сборки backend создаётся WAR:

```text
target/study-group-service-1.0-SNAPSHOT.war
```

Backend в Docker доступен на:

```text
http://localhost:8080
```

## Развёртывание на Helios

Для ручного развёртывания без Docker используется:

- Java 17;
- Maven;
- WildFly 41.0.1.Final;
- PostgreSQL на хосте `pg).

Backend запускается на порту:

```text
18080
```

Подробная инструкция находится в [helios_guide.md](./helios_guide.md).

При подключении к backend с Windows используется SSH-туннель, например:

```text
Windows localhost:18080
        ↓
      SSH
        ↓
Helios localhost:18080
```

## Основные API

### StudyGroup

- `POST /api/study-groups` — создание;
- `GET /api/study-groups/{id}` — получение по ID;
- `GET /api/study-groups` — получение коллекции с фильтрацией, сортировкой и пагинацией;
- `PUT /api/study-groups/{id}` — изменение;
- `DELETE /api/study-groups/{id}` — удаление.

### Специальные операции

- `GET /api/study-groups/special/count-by-admin/{adminId}`;
- `GET /api/study-groups/special/count-should-be-expelled-greater?value=...`;
- `GET /api/study-groups/special/admin-less-than/{adminId}`;
- `POST /api/study-groups/{id}/expel-all`;
- `POST /api/study-groups/transfer?sourceId=...&targetId=...`.

## Синхронизация клиентов

Frontend открывает SSE-соединение к:

```text
/api/stream
```

После изменения данных backend отправляет событие. Подключённые клиенты автоматически загружают актуальные коллекции.

Это позволяет другим клиентам автоматически видеть добавление, изменение и удаление объектов.

## Валидация и ограничения

Валидация выполняется на уровне Bean Validation и дополнительно поддерживается ограничениями PostgreSQL.

ID генерируется базой данных.

`creationDate` создаётся автоматически при сохранении объекта.

При некорректном пользовательском вводе frontend показывает информативные сообщения.

Удаление администратора, связанного с `StudyGroup`, запрещается с понятным сообщением об ошибке.

## Структура проекта

Основные каталоги:

```text
Labwork1/
├── src/
│   └── main/
│       └── java/
│           └── com/lab/
│               ├── config/
│               ├── controller/
│               ├── model/
│               ├── repository/
│               └── service/
├── frontend/
├── target/
├── pom.xml
├── docker-compose.yml
├── .env.example
├── README.md
└── helios_guide.md
```
