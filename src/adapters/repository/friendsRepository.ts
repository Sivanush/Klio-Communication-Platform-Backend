import { friendsModel } from "./schema/friendsModel";
import { requestModel } from "./schema/requestSchema";
import { userModel } from "./schema/userModel";




export class FriendsRepository{
    

    async findUsers(query:string,mainUser:string){
        return await userModel.find({username: new RegExp(query,'i'),_id:{$ne:mainUser}}).select('_id username email image')
     }

     async findExistingFriendRequestForBoth(userId1:string,userId2:string){
        return await requestModel.findOne({
            $or:[
                {sender:userId1,receiver:userId2},
                {sender:userId2,receiver:userId1}
            ]
        })
     }



     async findExistingFriendRequest(receiverId:string,senderId:string){
        return await requestModel.findOne({receiver:receiverId,sender:senderId})
     }


    //  async areAlreadyFriendsById(userId1: string, userId2: string){



    //     const user1Friends = await friendsModel.findOne({userId:userId1})
    //     const user2Friends = await friendsModel.findOne({userId:userId2})

    //     if (user1Friends && user1Friends.friends.map(f => f.toString()).includes(userId2)) {
    //         return true
    //     }

    //     if (user2Friends && user2Friends.friends.map(f => f.toString().includes(userId1))) {
    //         return true
    //     }

    //     return false

    //  }

     async areAlreadyFriendsById(userId: string) {
        return await friendsModel.findOne({ userId: userId });
    }
    

     async sendFriendRequest(receiverId:string,senderId:string){
        
        const friendRequest = new requestModel({receiver:receiverId,sender:senderId})
        return await friendRequest.save()
     }

     async findPendingRequest(userId:string){
        return await requestModel.find({receiver:userId}).populate('sender')
     }

     

     async findFriendRequest(requestId:string){
        return await requestModel.findById(requestId)
     }

    //  async getFriendsByUserId(sender:string){
    //     return await friendsModel.findById(sender)
    //  }

     async removeFriendRequest(id:string){
        return await requestModel.findByIdAndDelete(id);
      };


    async upsertFriends(userId:object|string,friendId:object|string){
        await friendsModel.updateOne(
            {userId:userId},
            {$addToSet:{friends:friendId}},
            {upsert:true}
        )
    }

    async findFriendRequestAndDelete(requestId:string){
        return await requestModel.findByIdAndDelete(requestId)
    }


    async removeMutualFriendRequests(senderId: string, receiverId: string) {
        await requestModel.deleteMany({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        });
    }


    async getAllFriendsByUserId(userId:string){
        return await friendsModel.findOne({userId:userId}).populate('friends')
    }

    async getUserImageByUserId(userId:string){
        return await userModel.findOne({_id:userId}).select('image')
    }
}