## Task Management API

API for managing tasks, allowing users to add, edit, delete, and view tasks.

## Technologies

1. NestJS as the backend framework
2. Prisma as the Object-Relational Mapper (ORM)
3. PostgreSQL as the database
4. Swagger as the API documentation tool
5. TypeScript as the programming language

## Installation

1. Install dependencies: `npm install`
2. Start a PostgreSQL database with docker using: `docker-compose up -d`. 
    - If you have a local instance of PostgreSQL running, you can skip this step. In this case, you will need to change the `DATABASE_URL` inside the `.env` file with a valid [PostgreSQL connection string](https://www.prisma.io/docs/concepts/database-connectors/postgresql#connection-details) for your database. 
3. Apply database migrations: `npx prisma migrate dev` 
4. Start the project:  `npm run start:dev`
5. Access the project SwaggerUI at http://localhost:3000/docs

_Note: Step 3 will also generate Prisma Client and seed the database. 
If not `npx prisma db seed`_

## Project structure

```bash
api
  ├── node_modules
  ├── prisma
  │   ├── migrations
  │   ├── schema.prisma
  │   └── seed.ts
  ├── src
  │   ├── prisma
  │   ├── app.controller.spec.ts
  │   ├── app.controller.ts
  │   ├── app.module.ts
  │   ├── app.service.ts
  │   ├── main.ts
  ├   ├── task
  │   └── validation.pipe.ts
  ├── test
  │   ├── app.e2e-spec.ts
  │   └── jest-e2e.json
  ├── README.md
  ├── .env
  ├── docker-compose.yml
  ├── nest-cli.json
  ├── package-lock.json
  ├── package.json
  ├── tsconfig.build.json
  └── tsconfig.json
```

Notables files and directories in this repository are:

- The `src` directory contains the source code for the application. 
- There are three modules:
1. The `app.module `is situated in the root of the src directory and is the entry point of the application. It is responsible for starting the web server.
2. The `prisma.module` contains the Prisma Client, your database query builder.
3. The `tasks.module` defines the endpoints for the `/tasks `route and accompanying business logic.

- The prisma module has the following:
1. The `schema.prisma` file defines the database schema.
2. The `migrations` directory contains the database migration history.
3. The `seed.ts` file contains a script to seed your development database with dummy data.
4. The `docker-compose.yml` file defines the Docker image for your `PostgreSQL` database.
5. The `.env` file contains the database connection string for your PostgreSQL database.

