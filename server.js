const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");

const middlewares = jsonServer.defaults();

server.use(middlewares);

// Обновляем middleware для обработки пагинации
server.use(jsonServer.bodyParser);

// Обновляем маршрут для обработки пагинации
server.use((req, res, next) => {
  if (!req.query._page || !req.query._limit) {
    next();
    return;
  }
  const page = parseInt(req.query._page) || 1;
  const limit = parseInt(req.query._limit) || 10;
  const start = (page - 1) * limit;
  const path = req.path.split("/").filter(Boolean).join(".");
  const results = router.db.get(path).value();
  const paginatedResults = results.slice(start, start + limit);
  const totalResults = results.length;
  const totalPages = Math.ceil(totalResults / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  res.setHeader("X-Total-Count", totalResults);
  res.send({
    results: paginatedResults,
    hasNext,
    hasPrev,
  });
  res.locals.data = {
    results: paginatedResults,
    hasNext,
    hasPrev,
  };
  next();
});
server.use(router);

// Listen to port
server.listen(3000, () => {
  console.log("JSON Server is running");
});

// Экспорт API сервера
module.exports = server;
