
import mongoose, { Schema, model, models } from "mongoose";

const CitySchema = new Schema({
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  userId: { type: String, required: true }, // We'll link this to the logged-in user
  addedAt: { type: Date, default: Date.now },
});

// This prevents Mongoose from creating the model twice during hot-reloads
const City = models.City || model("City", CitySchema);

export default City;