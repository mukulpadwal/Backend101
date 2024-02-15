import mongoose from "mongoose";

const nurseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    worksUnderDoctor: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Doctor",
        },
      ],
    },
    worksInHospitals: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Hospital",
        },
      ],
    },
  },
  { timestamps: true }
);

export const Nurse = mongoose.model("Nurse", nurseSchema);
