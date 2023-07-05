import { WorkSpaceModel } from "../schemas/workspace";

export const getWorkSpaces = () => {
    return WorkSpaceModel.find();
}

export const getWorkSpaceById = (id: string) => {
    return WorkSpaceModel.findById(id)
}

export const getWorkSpaceByCreatedBy = (createdBy: string) =>{
    return WorkSpaceModel.findOne({ createdBy })
}

export const deleteWorkSpaceById = (id: string) =>{
    return WorkSpaceModel.findOneAndDelete({ _id: id })
}

export const deleteWorkSpaceByCreatedBy = (createdBy: string) =>{
    return WorkSpaceModel.findOneAndDelete({ createdBy })
}

