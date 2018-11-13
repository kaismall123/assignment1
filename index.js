var express = require("express");
var exphbs = require("express-handlebars");
var path = require("path");
var bodyParser = require("body-parser");
var app = express();
var port = process.env.PORT || 5000;

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

app.set("views", path.join(__dirname, "./app/views"));

app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: "app/views/layouts",
    partialsDir: "app/views/partials"
  })
);

app.set("view engine", ".hbs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res, next) {
  res.render("index", {
    title: "Bootstrap Template",
    script: "/js/script.js"
  });
});

app.set("port", process.env.PORT || 5000);
var server = app.listen(port, function() {
  console.log("Express server listening on port " + server.address().port);
});
