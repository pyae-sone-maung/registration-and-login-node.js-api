const dotenv = require("dotenv");
dotenv.config({
    path: "./.env",
});
const app = require("./app");
const port = process.env.PORT || 5000;
const database = require("./src/config/database-config");

database.connect();
app.listen(port, () => console.log(`Server is running on port ${port}`));
