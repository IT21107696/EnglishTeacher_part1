const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");

const app = express();
const port = 3000;

app.use(bodyParser.json());


app.use(bodyParser.json());

