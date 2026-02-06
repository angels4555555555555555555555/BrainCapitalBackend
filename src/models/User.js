import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Männlich", "Weiblich", "Divers"],
      required: true,
    },
    shares: {
      type: Number,
      default: 0,
    },
    klarnaPurchasePrice: {
      type: Number,
      default: 0,
    },
    klarnaPrice: {
      type: Number,
      default: 0,
    },
    country: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    encryptedPassword: {
      type: String,
      required: true,
    },
    profilePicture: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dwa9gziu6/image/upload/v1753884468/generic_profile_crzbbe.png",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
    bank: {
      type: String,
      default: "",
    },
    laufzeit: {
      type: String,
      default: "",
    },
    betrag: {
      type: String,
      default: "",
    },
    zinsatz: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default model("User", userSchema);
