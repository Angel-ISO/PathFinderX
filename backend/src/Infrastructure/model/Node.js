import mongoose from 'mongoose';

const NodeSchema = new mongoose.Schema(
  {
    _id: {
      type: Number, 
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lon: {
      type: Number,
      required: true,
    },
    tags: {
      type: mongoose.Schema.Types.Mixed, 
      default: {},
    },
  },
  { timestamps: true, _id: false } 
);

const Node = mongoose.model('Node', NodeSchema);
export default Node;
