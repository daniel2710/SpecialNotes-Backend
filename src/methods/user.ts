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
        createdBy: {} // Establecemos el valor a null por ahora, lo actualizaremos más tarde con el ID del usuario
    };

    return new UserModel(values).save()
    .then((user) => {
        newWorkspaceData.createdBy = user._id; // Actualizamos el campo createdBy con el ID del usuario creado
        const newWorkspace = new WorkSpaceModel(newWorkspaceData); // Creamos una nueva instancia de Workspace con el createdBy actualizado
        values.workspace = newWorkspace._id
        return newWorkspace.save(); // Guardamos el espacio de trabajo
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