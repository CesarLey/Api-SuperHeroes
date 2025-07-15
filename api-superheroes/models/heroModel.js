import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  alias: { type: String, required: true },
  city: { type: String },
  team: { type: String }
});

const Hero = mongoose.model('Hero', heroSchema);

export default Hero; 