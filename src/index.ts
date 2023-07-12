import { createApp } from "./app";

const port = process.env.PORT || 5001;
const server = createApp();

server.listen(Number(port), '0.0.0.0', () => {
  console.log(`Server is listening on port ${port}`)
});
