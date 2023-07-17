# The booking system

This is the API for our booking application. It is built using Node.js, Express, Prisma and Supabase.

- The application is deployed in [Heroku](https://the-booking-app-7c531e760e9b.herokuapp.com/)
- Api documentation available [here](https://app.swaggerhub.com/apis/PERSONALGUGFUG/the-booking_system_api/1.0.5)
- Loom [video](https://www.loom.com/share/31be2772299145e9833db95a0b880d75?sid=9386e845-2242-44a5-ae7a-e9ba4f1c133e) with demo

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

```sh
gh repo clone patchwork-body/the-booking-system
```

1. Install the dependencies:

```sh
cd the-booking-system && pnpm install
```

1. Clone the repository:

```sh
pnpm dev
```

This will start the development server and watch for changes. You can access the API at `http://localhost:5001`.

## Testing

```sh
pnpm test
```

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

```txt
GET /v1/properties HTTP/1.1
Host: the-booking-app-7c531e760e9b.herokuapp.com
Connection: close
User-Agent: RapidAPI/4.2.0 (Macintosh; OS X/13.4.1) GCDHTTPRequest



POST /v1/auth/register HTTP/1.1
Content-Type: application/json
Host: the-booking-app-7c531e760e9b.herokuapp.com
Connection: close
User-Agent: RapidAPI/4.2.0 (Macintosh; OS X/13.4.1) GCDHTTPRequest
Content-Length: 88

{"email":"kirill.owner@mail.com","name":"Kirill","role":"OWNER","phone":"+381677812033"}

POST /v1/auth/register HTTP/1.1
Content-Type: application/json
Host: the-booking-app-7c531e760e9b.herokuapp.com
Connection: close
User-Agent: RapidAPI/4.2.0 (Macintosh; OS X/13.4.1) GCDHTTPRequest
Content-Length: 88

{"email":"kirill.guest@mail.com","name":"Kirill","role":"GUEST","phone":"+381637812033"}

POST /v1/auth/login HTTP/1.1
Content-Type: application/json
Host: the-booking-app-7c531e760e9b.herokuapp.com
Connection: close
User-Agent: RapidAPI/4.2.0 (Macintosh; OS X/13.4.1) GCDHTTPRequest
Content-Length: 77

{"email":"kirill.owner@mail.com","secret":"PCvHNtudNE4EQCDp7L2e5D30JRlDBOLo"}

POST /v1/auth/login HTTP/1.1
Content-Type: application/json
Host: the-booking-app-7c531e760e9b.herokuapp.com
Connection: close
User-Agent: RapidAPI/4.2.0 (Macintosh; OS X/13.4.1) GCDHTTPRequest
Content-Length: 77

{"email":"kirill.guest@mail.com","secret":"7MXUOriYc7RWxRiKnzuQeRKsqHu8TE5y"}

POST /v1/auth/refresh HTTP/1.1
Content-Type: application/json; charset=utf-8
Host: the-booking-app-7c531e760e9b.herokuapp.com
Connection: close
User-Agent: RapidAPI/4.2.0 (Macintosh; OS X/13.4.1) GCDHTTPRequest
Content-Length: 247

{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbGs2Z3A0cGgwMDAwdXIwa3d2MnFsNWI2IiwidG9rZW5JZCI6ImNsazZndjRxeTAwMDZ1cjBrOXJ5eGg1cjYiLCJpYXQiOjE2ODk1NzQyMTYsImV4cCI6MTY5MDE3OTAxNn0.hhED_tOGvbqkxQly1QnFHR2RjshSJ2WYNul89DApWDg"}

POST /v1/auth/revoke HTTP/1.1
Content-Type: application/json; charset=utf-8
Host: the-booking-app-7c531e760e9b.herokuapp.com
Connection: close
User-Agent: RapidAPI/4.2.0 (Macintosh; OS X/13.4.1) GCDHTTPRequest
Content-Length: 247

{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbGs2Z3A0cGgwMDAwdXIwa3d2MnFsNWI2IiwidG9rZW5JZCI6ImNsazZncjF3OTAwMDR1cjBrZ3MycDhodWoiLCJpYXQiOjE2ODk1NzQwMjUsImV4cCI6MTY5MDE3ODgyNX0.qMkpeT8W4OzQ2TPKMZBqaSlzh-bxb1iEtIQYtITNTtw"}

GET /v1/properties/clk6gx0mi0007ur0knbidd129 HTTP/1.1
Content-Type: application/json; charset=utf-8
Host: the-booking-app-7c531e760e9b.herokuapp.com
Connection: close
User-Agent: RapidAPI/4.2.0 (Macintosh; OS X/13.4.1) GCDHTTPRequest



POST /v1/properties HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbGs2Z3A0cGgwMDAwdXIwa3d2MnFsNWI2Iiwib3duZXJJZCI6ImNsazZncDRwdDAwMDJ1cjBrdmRzeTExbGciLCJyb2xlIjoiT1dORVIiLCJpYXQiOjE2ODk1NzQyMjQsImV4cCI6MTY4OTU3NzgyNH0.rrIdzy9msO0dev4WnOKxqIRdUI8XMNFcJYH8mz6F_zo
Content-Type: application/json; charset=utf-8
Host: the-booking-app-7c531e760e9b.herokuapp.com
Connection: close
User-Agent: RapidAPI/4.2.0 (Macintosh; OS X/13.4.1) GCDHTTPRequest
Content-Length: 124

{"name":"asdf","address":"asdf","price":1000,"currency":"USD","bathrooms":2,"bedrooms":3,"description":"awesome appartment"}

PATCH /v1/properties/clk6gx0mi0007ur0knbidd129 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbGs2Z3A0cGgwMDAwdXIwa3d2MnFsNWI2Iiwib3duZXJJZCI6ImNsazZncDRwdDAwMDJ1cjBrdmRzeTExbGciLCJyb2xlIjoiT1dORVIiLCJpYXQiOjE2ODk1NzQyMjQsImV4cCI6MTY4OTU3NzgyNH0.rrIdzy9msO0dev4WnOKxqIRdUI8XMNFcJYH8mz6F_zo
Content-Type: application/json
Host: the-booking-app-7c531e760e9b.herokuapp.com
Connection: close
User-Agent: RapidAPI/4.2.0 (Macintosh; OS X/13.4.1) GCDHTTPRequest
Content-Length: 33

{"name":"new name","price":10000}

DELETE /v1/properties/clk6gx0mi0007ur0knbidd129 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbGs2Z3A0cGgwMDAwdXIwa3d2MnFsNWI2Iiwib3duZXJJZCI6ImNsazZncDRwdDAwMDJ1cjBrdmRzeTExbGciLCJyb2xlIjoiT1dORVIiLCJpYXQiOjE2ODk1NzQyMjQsImV4cCI6MTY4OTU3NzgyNH0.rrIdzy9msO0dev4WnOKxqIRdUI8XMNFcJYH8mz6F_zo
Host: the-booking-app-7c531e760e9b.herokuapp.com
Connection: close
User-Agent: RapidAPI/4.2.0 (Macintosh; OS X/13.4.1) GCDHTTPRequest



GET /v1/properties/clk6gx0mi0007ur0knbidd129/owner HTTP/1.1
Host: the-booking-app-7c531e760e9b.herokuapp.com
Connection: close
User-Agent: RapidAPI/4.2.0 (Macintosh; OS X/13.4.1) GCDHTTPRequest



GET /v1/properties/clk6gx0mi0007ur0knbidd129/reservations HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbGs2Z3A0cGgwMDAwdXIwa3d2MnFsNWI2Iiwib3duZXJJZCI6ImNsazZncDRwdDAwMDJ1cjBrdmRzeTExbGciLCJyb2xlIjoiT1dORVIiLCJpYXQiOjE2ODk1NzQyMjQsImV4cCI6MTY4OTU3NzgyNH0.rrIdzy9msO0dev4WnOKxqIRdUI8XMNFcJYH8mz6F_zo
Host: the-booking-app-7c531e760e9b.herokuapp.com
Connection: close
User-Agent: RapidAPI/4.2.0 (Macintosh; OS X/13.4.1) GCDHTTPRequest



POST /v1/properties/clk6gx0mi0007ur0knbidd129/reservations HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbGs2aHFiaXAwMDA0cXgwa3RhNjh3a2ViIiwiZ3Vlc3RJZCI6ImNsazZocWJpdDAwMDZxeDBramVtY2ltNjEiLCJyb2xlIjoiR1VFU1QiLCJpYXQiOjE2ODk1NzU3MDMsImV4cCI6MTY4OTU3OTMwM30.Q9n_WM1D8Q7HlY1McS4Qe47qkGKnEnOqMaWpB-6bisU
Accept: application/json
Content-Type: application/json; charset=utf-8
Host: the-booking-app-7c531e760e9b.herokuapp.com
Connection: close
User-Agent: RapidAPI/4.2.0 (Macintosh; OS X/13.4.1) GCDHTTPRequest
Content-Length: 109

{"checkIn":"2023-12-10T14:30:00Z","checkOut":"2023-12-16T14:30:00Z","guestIds":["clk6hqbit0006qx0kjemcim61"]}

GET /v1/properties/clk6gx0mi0007ur0knbidd129/chats HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbGs2Z3A0cGgwMDAwdXIwa3d2MnFsNWI2Iiwib3duZXJJZCI6ImNsazZncDRwdDAwMDJ1cjBrdmRzeTExbGciLCJyb2xlIjoiT1dORVIiLCJpYXQiOjE2ODk1NzQyMjQsImV4cCI6MTY4OTU3NzgyNH0.rrIdzy9msO0dev4WnOKxqIRdUI8XMNFcJYH8mz6F_zo
Host: the-booking-app-7c531e760e9b.herokuapp.com
Connection: close
User-Agent: RapidAPI/4.2.0 (Macintosh; OS X/13.4.1) GCDHTTPRequest



GET /v1/guests/clk6hqbit0006qx0kjemcim61/reservations HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbGs2aHFiaXAwMDA0cXgwa3RhNjh3a2ViIiwiZ3Vlc3RJZCI6ImNsazZocWJpdDAwMDZxeDBramVtY2ltNjEiLCJyb2xlIjoiR1VFU1QiLCJpYXQiOjE2ODk1NzU3MDMsImV4cCI6MTY4OTU3OTMwM30.Q9n_WM1D8Q7HlY1McS4Qe47qkGKnEnOqMaWpB-6bisU
Host: the-booking-app-7c531e760e9b.herokuapp.com
Connection: close
User-Agent: RapidAPI/4.2.0 (Macintosh; OS X/13.4.1) GCDHTTPRequest



GET /v1/guests/clk6hqbit0006qx0kjemcim61/chats HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbGs2aHFiaXAwMDA0cXgwa3RhNjh3a2ViIiwiZ3Vlc3RJZCI6ImNsazZocWJpdDAwMDZxeDBramVtY2ltNjEiLCJyb2xlIjoiR1VFU1QiLCJpYXQiOjE2ODk1NzU3MDMsImV4cCI6MTY4OTU3OTMwM30.Q9n_WM1D8Q7HlY1McS4Qe47qkGKnEnOqMaWpB-6bisU
Host: the-booking-app-7c531e760e9b.herokuapp.com
Connection: close
User-Agent: RapidAPI/4.2.0 (Macintosh; OS X/13.4.1) GCDHTTPRequest



GET /v1/reservations/clk6hrul80009qx0kq39n3as7 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbGs2aHFiaXAwMDA0cXgwa3RhNjh3a2ViIiwiZ3Vlc3RJZCI6ImNsazZocWJpdDAwMDZxeDBramVtY2ltNjEiLCJyb2xlIjoiR1VFU1QiLCJpYXQiOjE2ODk1NzU3MDMsImV4cCI6MTY4OTU3OTMwM30.Q9n_WM1D8Q7HlY1McS4Qe47qkGKnEnOqMaWpB-6bisU
Host: the-booking-app-7c531e760e9b.herokuapp.com
Connection: close
User-Agent: RapidAPI/4.2.0 (Macintosh; OS X/13.4.1) GCDHTTPRequest



GET /v1/chats/clk6dggat000dvkgvfcl5pern/messages HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbGs2aHFiaXAwMDA0cXgwa3RhNjh3a2ViIiwiZ3Vlc3RJZCI6ImNsazZocWJpdDAwMDZxeDBramVtY2ltNjEiLCJyb2xlIjoiR1VFU1QiLCJpYXQiOjE2ODk1NzU3MDMsImV4cCI6MTY4OTU3OTMwM30.Q9n_WM1D8Q7HlY1McS4Qe47qkGKnEnOqMaWpB-6bisU
Host: the-booking-app-7c531e760e9b.herokuapp.com
Connection: close
User-Agent: RapidAPI/4.2.0 (Macintosh; OS X/13.4.1) GCDHTTPRequest




```
