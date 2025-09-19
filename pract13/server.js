const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index", { error: null });
});

app.post("/calculate", (req, res) => {
  let { income1, income2 } = req.body;

  income1 = parseFloat(income1);
  income2 = parseFloat(income2);

  if (isNaN(income1) || isNaN(income2) || income1 < 0 || income2 < 0) {
    return res.render("index", { error: "Please enter valid positive numbers." });
  }

  const total = income1 + income2;
  res.render("result", { income1, income2, total });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
