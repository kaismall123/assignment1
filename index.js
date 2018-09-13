var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 5000;
const mysqlx = require('@mysql/xdevapi');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.post("/", function(req, res) {
  var myTable;
  var results;
  var errorBlankInput = "Error. You have not typed in the name of a city.";
  var errorInvalidInput = "Error. You have typed in a invalid city name.";
  if (req.body.cityName == "") {
    console.log(errorBlankInput);
    res.render('index', {
      "resultsArray": errorBlankInput,
      title: "City State App"
    });
    return;
  }
  var session;
  mysqlx
    .getSession('root:davidtr613@localhost')
    .then(function(s) {
      session = s;
      return session.getSchema('citystate');
    })
    .then(function() {
      return Promise.all([
        session.sql('USE citystate').execute()
      ])
    })
    .then(function() {
      return session.sql("SELECT COUNT(*) FROM citystatedata WHERE City = '" + req.body.cityName + "'").execute(function(row) {
        console.log("The number of rows in the database which have the city name", req.body.cityName, "is", row);
        if (row == 0) {
          console.log(errorInvalidInput);
          res.render('index', {
            "resultsArray": errorInvalidInput,
            title: "City State App"
          });
        }
      });
    });

  mysqlx
    .getSession({
      user: 'root',
      password: 'davidtr613',
      host: 'localhost',
      port: 33060
    })
    .then(function(session) {
      myTable = session.getSchema('citystate').getTable('citystatedata');
    })
    .then(function() {
      return myTable
        .select(['StateShort'])
        .where("City = '" + req.body.cityName + "'")
        .limit("1")
        .execute(function(row) {
          results = row;
          console.log("The state that the city " + req.body.cityName + " is located in is: " + row);
          res.render('index', {
            "resultsArray": results,
            title: "City State App"
          });
        });
    })
});

app.set('views', path.join(__dirname, './app/views'));

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: 'app/views/layouts',
  partialsDir: 'app/views/partials'
}))

app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
  res.render('index', {
    title: 'City State App'
  });
});

app.set('port', process.env.PORT || 5000);
var server = app.listen(port, function() {
  console.log('Express server listening on port ' + server.address().port);
})