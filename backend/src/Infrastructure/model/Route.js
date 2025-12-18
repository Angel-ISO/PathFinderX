import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true }
}, { _id: false });

const routeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  route: [nodeSchema],
  totalDistance: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Route = mongoose.model('Route', routeSchema);

export default Route;