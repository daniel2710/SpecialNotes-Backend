import crypto from 'crypto';

const SECRET_KEY = process.env.SECRET_KEY

export const randomToken = () =>{
  return crypto.randomBytes(128).toString('base64');
}

export const authentication = (token: string, password: string) =>{
  if(SECRET_KEY){
    return crypto.createHmac('sha256', [token, password].join('/')).update(SECRET_KEY).digest()
  }

  return null;
}