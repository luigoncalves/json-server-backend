// Required modules
const jsonServer = require("json-server");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");

// Loading Environment Variables
require("dotenv").config();

// Json server instance
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const PORT = process.env.PORT;


server.use(middlewares);
server.use(morgan("dev"));
server.use((req, res, next) => {
  // Middleware to disable CORS
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Login route
server.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Auth user
  const user = router.db.get("users").find({ username, password }).value();

  if (user) {
    // Creating JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    // Updating user data with token
    router.db
      .get("users")
      .find({ username, password })
      .assign({ token })
      .write()

    res.json({ token })
  } else {
    res.status(401).json({ error: 'Invalid credentials' })
  }
})

// Using Json server as router
server.use(router);

// Start the server
server.listen(PORT, () => {
  console.log(`JSON Server is running at port ${PORT}`);
});
