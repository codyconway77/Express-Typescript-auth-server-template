import { model, Model, Schema, Document, ObjectId } from 'mongoose';

interface IUser extends Document {
    email: string,
    username: string,
    password: string,
    _id: ObjectId
}

const UserSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const User: Model<IUser> = model('User', UserSchema);
export default User;