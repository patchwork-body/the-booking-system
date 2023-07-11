import { createServer } from "./server";

const port = process.env.PORT || 5001;
const server = createServer();

server.listen(Number(port));
