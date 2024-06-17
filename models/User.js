import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
});

const UserModel = mongoose.model("users", UserSchema);

export default UserModel;
