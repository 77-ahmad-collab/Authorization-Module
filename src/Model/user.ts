import { Schema } from 'mongoose';
export interface User {
  name: string;
  email: string;
  password: string;
}
export const UserSchema = new Schema({
  name: {
    lowercase: true,
    trim: true,
    type: String,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
  },
});
