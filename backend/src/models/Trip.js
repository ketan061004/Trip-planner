import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    // Full wizard payload (fromCity, destination, dates, travelers, budget,
    // currency, tripType, interests[], preferences{...}) — lets us rehydrate
    // the wizard for edit/regenerate.
    input: { type: mongoose.Schema.Types.Mixed, default: {} },
    // Generated plan JSON (same shape planService returns).
    plan: { type: mongoose.Schema.Types.Mixed, default: {} },
    coverImage: { type: String, default: "" },
    startDate: { type: Date },
    isPublic: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.models.Trip || mongoose.model("Trip", tripSchema);
