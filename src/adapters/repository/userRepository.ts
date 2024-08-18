import { ObjectId, Types } from "mongoose";
import { User } from "../../entity/user";
import { Friends, friendsModel } from "./schema/friendsModel";
import { requestModel } from "./schema/requestSchema";
import { userI, userModel } from "./schema/userModel";
import { IUserRepository } from "./interface/IUserRepository";

export class UserRepository implements IUserRepository{


    async findUserByEmail(email: string): Promise<User | null> {
        return await userModel.findOne({ email });
      }
    
      async findUserById(id: string): Promise<User | null> {
        return await userModel.findById(id);
      }
    
      async deleteTheUserById(id: string): Promise<void> {
        await userModel.findByIdAndDelete(id);
      }
    
      async createUser(userEntity: User): Promise<User> {
        const userDoc = new userModel(userEntity);
        const savedUser = await userDoc.save();
    
        const user: User = {
          _id: (savedUser._id as unknown as string),
          email: savedUser.email,
          username: savedUser.username,
          password: savedUser.password,
          isVerified: savedUser.isVerified,
          isGoogle: savedUser.isGoogle,
          isBlocked: savedUser.isBlocked,
          image: savedUser.image,
          bio: savedUser.bio
        };
    
        return user;
      }
    
      async userVerifying(email: string): Promise<void> {
        await userModel.updateOne({ email }, { $set: { isVerified: true } });
      }
    
      async updateUser(userData: User): Promise<User | null> {
        return await userModel.findByIdAndUpdate(userData._id, userData, { new: true });
      }
    
      async findUserByToken(token: string): Promise<User | null> {
        return await userModel.findOne({ resetToken: token, resetTokenExpire: { $gt: Date.now() } });
      }
    
      async updateUserBio(bio: string, userId: string): Promise<void> {
        await userModel.findByIdAndUpdate(userId, { $set: { bio } });
      }
    
      async updateUserStatus(status: string, customStatus: string, userId: string): Promise<void> {
        await userModel.findByIdAndUpdate(userId, {
          $set: {
            status,
            customStatus,
          }
        });
      }
    
      async updateUserToOnline(userId: string): Promise<void> {
        await userModel.findByIdAndUpdate(userId, { $set: { status: 'online' } });
      }
    
      async updateUserToOffline(userId: string): Promise<void> {
        await userModel.findByIdAndUpdate(userId, { $set: { status: 'offline' } });
      }
}
