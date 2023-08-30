import mongoose from "mongoose";
import { settingsNotesSchema } from './settingsNotes'

const NotesSchema = new mongoose.Schema({
    workSpaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkSpace' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    settings: { type: settingsNotesSchema, required: false },
    createdAt: { type: Date, default: Date.now }
})

export const NotesModel = mongoose.model("Notes", NotesSchema)


