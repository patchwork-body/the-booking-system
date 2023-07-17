# The booking system

This is the API for our booking application. It is built using Node.js, Express, Prisma and Supabase.

## Architecture

The architecture of the project that implements a REST API using Node.js, Express.js, TypeScript, Prisma, Zod, and Supabase can be described as follows:

- **Presentation layer**: This layer handles incoming HTTP requests and outgoing HTTP responses. It is implemented using Express.js and OpenAPI. The OpenAPI specification is used to define the API endpoints and their input/output schemas.
- **Application layer**: This layer contains the business logic of the application. It is implemented using TypeScript and Zod. Zod is used for input validation of incoming requests. The application layer interacts with the persistence layer to retrieve and manipulate data.
- **Persistence layer**: This layer handles database interactions. It is implemented using Prisma and Supabase. Prisma is used as an ORM to interact with the database, while Supabase is used as the database itself. Supabase provides a PostgreSQL database with built-in authentication and authorization features.

Overall, this architecture follows a layered approach, with each layer responsible for a specific set of tasks. The layers are loosely coupled, which allows for easier maintenance and scalability of the application.

## Libraries

The following libraries are used in this project:

- Express: A fast, unopinionated, minimalist web framework for Node.js.
- OpenAPI: A specification for building APIs.
- TypeScript: A typed superset of JavaScript that compiles to plain JavaScript.
- Zod: A TypeScript-first schema validation library.
- Prisma: A modern database toolkit for Node.js and TypeScript.
- Supabase: An open-source alternative to Firebase.

## Getting Started

To get started with development, follow these steps:

1. Clone the repository:
   `gh repo clone patchwork-body/the-booking-system`

2. Install the dependencies:
   `cd the-booking-system && pnpm install`

3. Start the development server:
   `pnpm dev`

This will start the development server and watch for changes. You can access the API at `http://localhost:5001`.

## Testing

`pnpm test`

To run the tests, use the following command:

This will run the tests and output the results to the console.

## Contributing

If you'd like to contribute to this project, please follow these guidelines:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and commit them with a descriptive message
4. Push your changes to your fork
5. Create a pull request

We'll review your changes and merge them if they look good.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
