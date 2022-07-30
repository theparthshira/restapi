let Joi = require("joi");
let express = require("express");
let app = express();
let mysql = require("mysql");
const { query } = require("express");
let cors = require("cors");

let db_config = {
  host: "localhost",
  user: "root",
  password: "",
  database: "parth_test",
};
// let conn = mysql.createConnection(db_config);

app.use(express.json());
app.use(cors());

var conn;

function handleDisconnect() {
  conn = mysql.createConnection(db_config);

  conn.connect(function (err) {
    if (err) {
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000);
    }
  });

  conn.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

//get all

app.get("/customers", (req, res) => {
  let q = "SELECT * FROM Customers";
  conn.query(q, (err, data) => {
    if (err) return res.status(400).send(err);

    res.send(data);
  });
});

//get by id
app.get("/customers/:id", (req, res) => {
  let q = "SELECT * FROM Customers";
  conn.query(q, (err, result) => {
    if (err) return res.status(400).send(err);

    let str = JSON.stringify(result);
    let json = JSON.parse(str);

    // console.log(result);
    // res.send(result);
    // console.log(q2);

    let user = req.params.id;
    let data = undefined;

    for (let i = 0; i < json.length; i++) {
      if (json[i].CustomerID === parseInt(user)) {
        data = json[i];
      }
    }

    if (data === undefined) {
      res.status(404).send("User not found");
    } else {
      res.send(data);
    }
  });
});

//post

app.post("/customers", (req, res) => {
  const schema = {
    CustomerID: Joi.number().required(),
    CustomerName: Joi.string().required(),
    ContactName: Joi.string().required(),
    Country: Joi.string().required(),
  };

  const result = Joi.validate(req.body, schema);

  if (result.error) {
    res.status(400).send(result);
    return;
  }

  let id = req.body.CustomerID;
  let n1 = req.body.CustomerName;
  let contact = req.body.ContactName;
  let c1 = req.body.Country;

  let sql = `INSERT INTO Customers VALUES (${parseInt(
    id
  )},'${n1}','${contact}','${c1}')`;

  conn.query(sql, (err, data) => {
    if (err) return res.send(err);

    res.send("successful");
    return;
  });
});

//put

app.put("/customers/:id", (req, res) => {
  let sql = "SELECT * FROM Customers";

  conn.query(sql, (err, data) => {
    let str = JSON.stringify(data);
    let json = JSON.parse(str);
    let target = req.params.id;

    const schema = {
      CustomerID: Joi.number().required(),
      CustomerName: Joi.string().required(),
      ContactName: Joi.string().required(),
      Country: Joi.string().required(),
    };

    const result = Joi.validate(req.body, schema);

    if (result.error) {
      res.status(400).send(result);
      return;
    }

    let id = req.body.CustomerID;
    let n1 = req.body.CustomerName;
    let contact = req.body.ContactName;
    let c1 = req.body.Country;

    let sql1 = `UPDATE Customers SET CustomerID='${parseInt(
      id
    )}',CustomerName='${n1}',ContactName='${contact}',Country='${c1}' WHERE CustomerID=${parseInt(
      target
    )}`;

    conn.query(sql1, (err, response) => {
      if (err) res.send(err);
      res.send(response);
    });
  });
});

//delete

app.delete("/customers/:id", (req, res) => {
  let toFilter = parseInt(req.params.id);
  let sql = `DELETE FROM Customers WHERE CustomerID=${toFilter}`;

  conn.query(sql, (err, data) => {
    if (err) res.send(err);

    res.send(data);
  });
});

app.listen(2020);
