import { Request } from 'express';

export interface IUser {
  id: number;
  sid: string;
}

export class IRequest extends Request {
  user: IUser;
  roles: string[];
}
