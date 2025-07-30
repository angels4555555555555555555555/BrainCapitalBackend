import { Schema, model } from "mongoose";

const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        url: {
          type: String,
          default: "https://res.cloudinary.com/dwa9gziu6/image/upload/v1753884468/generic_profile_crzbbe.png",
        },
        publicId: {
          type: String,
          default: "",
        },
    },
},
    { timestamps: true}
);

export default model("Admin", adminSchema);
