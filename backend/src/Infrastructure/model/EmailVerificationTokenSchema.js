import mongoose from 'mongoose';

const EmailVerificationTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

EmailVerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('EmailVerificationToken', EmailVerificationTokenSchema);
