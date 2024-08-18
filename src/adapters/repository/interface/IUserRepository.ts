import { User } from "../../../entity/user";


export interface IUserRepository {
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
  deleteTheUserById(id: string): Promise<void>;
  createUser(userEntity: User): Promise<User>;
  userVerifying(email: string): Promise<void>;
  updateUser(userData: User): Promise<User | null>;
  findUserByToken(token: string): Promise<User | null>;
  updateUserBio(bio: string, userId: string): Promise<void>;
  updateUserStatus(status: string, customStatus: string, userId: string): Promise<void>;
  updateUserToOnline(userId: string): Promise<void>;
  updateUserToOffline(userId: string): Promise<void>;
}