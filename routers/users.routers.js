import express from "express";
import bcrypt from "bcrypt"
import { addUser, getUserByName } from "../service/users.service.js";
import jwt from "jsonwebtoken";

const router = express.Router();

async function genHashedPassword(password) {
    const NO_OF_ROUNDS = 10;
    const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(salt);
    console.log(hashedPassword);
    return hashedPassword;
  }

// create
router.post("/signup", async function (request, response) {
    const {username, email, password, phone, name} = request.body

    const userFormDB = await getUserByName(email);
    console.log(userFormDB);

    if (userFormDB) {
        response.status(400).send({message: "Email already exists"})
    } else if (password.length < 8) {
        response.status(400).send({message: "Password must be atleast 8 characters"})
    } else {
        const hashedPassword = await genHashedPassword(password);
        console.log(password, hashedPassword)
    
        const result = await addUser({
            username: username,
            email: email,
            password: hashedPassword,
            phone: phone,
            name: name,
        });    
        response.send(result)
    }

});


router.post("/login", async function (request, response) {
    const { email, password } = request.body

    const userFormDB = await getUserByName(email);
    console.log(userFormDB);

    if (!userFormDB) {
        response.status(400).send({message: "Invalid credentials"})
    } else {
        const storedBDPassword = userFormDB.password;
        const isPasswordMatch = await bcrypt.compare(password, storedBDPassword)
        console.log(isPasswordMatch)
        if (isPasswordMatch) {
            const token = jwt.sign({id: userFormDB._id}, process.env.SECRET_KEY);
            response.send({message: "Successful login", token: token})
        } else{
            response.status(400).send({message: "Invalid credentials"})
        }
    }

});


export default router;
