const express = require("express");
const app = express();
const produtoRota = require("./rotas/produtos")
const indexRoute = require('./rotas/index.rota')
var expressLayouts = require('express-ejs-layouts')
app.set('view engine', 'ejs')
app.set('layout', 'layouts/layout-home')
app.use(expressLayouts)
app.use(express.json())
app.use('/static', express.static('public'))

app.use("/api/produto", produtoRota)

app.use('/', indexRoute)
app.get("/", (req, res) => {
  res.json({ msg: "Hello from Express!" });
});

app.listen(8080, () => {
  console.log("Servidor pronto na porta 8080");
});