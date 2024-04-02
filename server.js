const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");

const middlewares = jsonServer.defaults();

server.use(middlewares);

// Обновляем middleware для обработки пагинации
server.use(jsonServer.bodyParser);

server.use(router);

// Listen to port
server.listen(3000, () => {
  console.log("JSON Server is running");
});

// Экспорт API сервера
module.exports = server;
