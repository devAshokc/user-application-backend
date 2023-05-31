// const express = require("express"); // "type": "commonjs"
import express from "express"; // "type": "module"
import { MongoClient } from "mongodb";
import usersRouter from "./routers/users.routers.js"
import * as dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
const app = express();
app.use(cors()); 

const PORT = process.env.PORT

const MONGO_URL = process.env.MONGO_URL
const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("Mongo is connected 🎇🎇")

// express.json() - middleware (inbuilt) | converts data to Json
app.use(express.json());

// Hello world
app.get("/", function (request, response) {
    response.send("🙋‍♂️, 🌏 🎊✨🤩");
});

app.use("/users", usersRouter)

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));

export {client}