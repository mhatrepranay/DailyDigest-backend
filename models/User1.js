import mongoose from 'mongoose';

const UserSchema1 = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    confpassword: String,
    role: String
}, { timestamps: true });

const UserModel1 = mongoose.model("users1", UserSchema1);

export default UserModel1;
