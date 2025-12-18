import mongoose from 'mongoose';

const WaySchema = new mongoose.Schema(
  {
    _id: {
      type: Number, 
      required: true,
    },
    nodes: {
      type: [Number], 
      required: true,
    },
    tags: {
      type: mongoose.Schema.Types.Mixed, 
      default: {},
    },
  },
  { timestamps: true, _id: false }
);

const Way = mongoose.model('Way', WaySchema);
export default Way;
