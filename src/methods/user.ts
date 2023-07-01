import { UserModel } from "../schemas/users";

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
    UserModel.findOne({
        'authentication.sessionToken': sessionToken
    })
}

export const createUser = (values: Record<string, any>) =>{
    return new UserModel(values).save().then((user)=>{
        user.toObject()
    })
}

export const deleteUserById = (id: string) =>{
    return UserModel.findOneAndDelete({ _id: id })
}

export const updateUserById = (id: string, values: Record<string, any>) =>{
    return UserModel.findByIdAndUpdate(id, values)
}