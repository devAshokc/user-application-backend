import { client } from "../index.js";

export async function addUser(data) {
    return await client
        .db("Application")
        .collection("users")
        .insertOne(data);
}


export async function getUserByName(email) {
    return await client
        .db("Application")
        .collection("users")
        .findOne({email: email});
}