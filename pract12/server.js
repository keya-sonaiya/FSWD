const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("calculator", { result: null, error: null });
});

app.post("/calculate", (req, res) => {
  let { num1, num2, operation } = req.body;

  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);

  if (isNaN(n1) || isNaN(n2)) {
    return res.render("calculator", { result: null, error: "❌ Please enter valid numbers!" });
  }

  let result;
  switch (operation) {
    case "add":
      result = n1 + n2;
      break;
    case "subtract":
      result = n1 - n2;
      break;
    case "multiply":
      result = n1 * n2;
      break;
    case "divide":
      if (n2 === 0) {
        return res.render("calculator", { result: null, error: "❌ Cannot divide by zero!" });
      }
      result = n1 / n2;
      break;
    default:
      return res.render("calculator", { result: null, error: "❌ Invalid operation!" });
  }

  res.render("calculator", { result, error: null });
});

app.listen(PORT, () => {
  console.log(`Calculator running at http://localhost:${PORT}`);
});
