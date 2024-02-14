import mongoose from "mongoose";

const nurseSchema = new mongoose.Schema({}, { timestamps: true });

export const Nurse = mongoose.model("Nurse", nurseSchema);
