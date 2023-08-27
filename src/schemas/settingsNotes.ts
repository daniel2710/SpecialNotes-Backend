import mongoose from "mongoose";

export const settingsNotesSchema = new mongoose.Schema({
    archived: { type: Boolean, required: false, default: false },
    pinned: { type: Boolean, required: false, default: false },
    backgroundColor: { type: String, default: 'rich-black', enum: ["rich-black", "cherry-red", "cliff-blue", "qahvei-brown"] },
})

export const settingsNotesModel = mongoose.model("settingsNotes", settingsNotesSchema)

 