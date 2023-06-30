import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    birthday: { type: Date, required: false },
    username: { type: String, required: true },
    email: { type: String, required: true },
    authentication: {
        password: { type: String, required: true, select: false } 
    },
    createdAt: { type: Date, default: Date.now }
})

export const UserModel = mongoose.model("User", UserSchema)


