export interface IUserJwtPayload{
  header: { 
    alg: string,
    typ: string 
  },
  payload: {
    name: string;
    sub: number;
  }
  signature: string
}

