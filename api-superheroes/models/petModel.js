import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  adoptedBy: { type: Number, default: null },
  salud: { type: Number, default: 100 },
  felicidad: { type: Number, default: 100 },
  hambre: { type: Number, default: 50 },
  limpieza: { type: Number, default: 100 },
  ropa: { type: [Object], default: [] },
  enfermo: { type: Boolean, default: false },
  ultimoEstado: { type: String, default: () => new Date().toISOString() },
  muerta: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Pet = mongoose.model('Pet', petSchema);

export default Pet; 