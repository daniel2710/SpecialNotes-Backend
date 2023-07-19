import { NotesModel } from "../schemas/notes";

export const getNotes = () => {
    return NotesModel.find();
}

export const getNoteById = (id: string) =>{
    return NotesModel.findById(id)
}

export const createNote = (values: Record<string, any>) =>{
    return new NotesModel(values).save()
}

export const deleteNoteById = (id: string) =>{
    return NotesModel.findOneAndDelete({ _id: id })
}

export const deleteNotesByUserId = async (userId: string) => {
    return NotesModel.deleteMany({ userId });
}
