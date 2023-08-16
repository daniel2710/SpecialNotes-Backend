import { UserModel } from "../schemas/users";
import { WorkSpaceModel } from "../schemas/workspace";

export const getUsers = () => {
    return UserModel.find();
}

export const getUserByEmail = (email: string) =>{
    return UserModel.findOne({ email })
}

export const getUserByUsername = (username: string) =>{
    return UserModel.findOne({ username })
}

export const getUserById = (id: string) =>{
    return UserModel.findById(id)
}

export const getUserBySessionToken = (sessionToken: string) =>{
    return UserModel.findOne({
        'authentication.sessionToken': sessionToken
    })
}

export const createUser = (values: Record<string, any>) =>{

    const newWorkspaceData = {
        name: 'My workspace',
        description: 'My workspace',
        theme: 'light',
        createdBy: {} 
    };

    return new UserModel(values).save()
    .then((user) => {
        newWorkspaceData.createdBy = user._id;
        const newWorkspace = new WorkSpaceModel(newWorkspaceData); 
        values.workspace = newWorkspace._id
        return newWorkspace.save();
    })
    .catch((error) => {
        throw new Error(`Error al crear usuario y espacio de trabajo: ${error}`);
    });
}

export const deleteUserById = (id: string) =>{
    return UserModel.findOneAndDelete({ _id: id })
}

export const updateUserById = (id: string, values: Record<string, any>) =>{
    return UserModel.findByIdAndUpdate(id, values)
}