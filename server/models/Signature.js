import mongoose from 'mongoose';

const signatureSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    enrollmentNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 20
    },
    roomNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10
    },
    signatureData: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { versionKey: false }
);

signatureSchema.index({ enrollmentNumber: 1 }, { unique: true });

export default mongoose.model('Signature', signatureSchema);