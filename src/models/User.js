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
    products: [{
      type: String,
      enum: ["festgeld", "tagesgeld", "openAI"],
    }],
    festgeld: {
      bank: {
        type: String,
        default: "",
      },
      betrag: {
        type: Number,
        default: 0,
      },
      zinsen: {
        type: Number,
        default: 0,
      },
      laufzeit: {
        type: String,
        default: "",
      },
    },
    tagesgeld: {
      bank: {
        type: String,
        default: "",
      },
      betrag: {
        type: Number,
        default: 0,
      },
      zinsen: {
        type: Number,
        default: 0,
      },
      garantierteZinslaufzeit: {
        type: String,
        default: "",
      },
    },
    openAI: {
      anzahl: {
        type: Number,
        default: 0,
      },
      gekaufterWert: {
        type: Number,
        default: 0,
      },
      aktuellerWert: {
        type: Number,
        default: 0,
      },
      investition: {
        type: Number,
        default: 0,
      },
      aktuellerGewinn: {
        type: Number,
        default: 0,
      },
      depotWert: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

export default model("User", userSchema);
