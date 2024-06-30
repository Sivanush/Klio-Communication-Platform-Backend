import { FriendsRepository } from "../adapters/repository/friendsRepository";
import { SearchUser, User } from "../entity/user";


export class FriendsUseCase{
    constructor(private friendsRepository:FriendsRepository){
    
    }


    
    async executeSearchUsers(query: string, mainUser: string) {
        const users = await this.friendsRepository.findUsers(query, mainUser) as SearchUser[]

        const updatedUsers = await Promise.all(users.map(async(user:SearchUser)=>{
            
            const friendShipStatus = await this.getFriendShipStatus(mainUser,user._id.toString())
            console.log(friendShipStatus,'✅✅✅');
            
            return {...user,friendshipStatus:friendShipStatus}
        }))
        console.log(updatedUsers);
        return updatedUsers
    }


    private async getFriendShipStatus(userId1:string,userId2:string){
        const friendRequest = await this.friendsRepository.findExistingFriendRequestForBoth(userId1,userId2)

        const user1Friends = await this.friendsRepository.getAllFriendsByUserId(userId1)
        const user2Friends = await this.friendsRepository.getAllFriendsByUserId(userId2)

        
        if (user1Friends && user1Friends.friends.map(f=> f.toString().includes(userId2)) && user2Friends && user2Friends.friends.map(f=> f.toString().includes(userId2)) ) {
            return 'Friends'
        }else if(friendRequest){
            return friendRequest.sender?.toString() === userId1 ? 'Sended' : 'Received'
        }else{
            return 'none'
        }
    }



    async executeSendRequest(receiverId: string, senderId: string) {
        const existRequest = await this.friendsRepository.findExistingFriendRequest(receiverId, senderId)
        if (existRequest) {
            throw new Error("Friend request already sent")
        }

        const user1Friends = await this.friendsRepository.areAlreadyFriendsById(senderId);    
        const user2Friends = await this.friendsRepository.areAlreadyFriendsById(receiverId);
    
        if (user1Friends && user1Friends.friends.map(f => f.toString()).includes(receiverId)) {
            throw new Error("Users are already friends");
        }

        
        
    
        if (user2Friends && user2Friends.friends.map(f => f.toString()).includes(senderId)) {
            throw new Error("Users are already friends");
        }


        await this.friendsRepository.sendFriendRequest(receiverId, senderId)
    }



    async executeListPendingRequest(userId: string) {
        return await this.friendsRepository.findPendingRequest(userId)
    }


    async executeAcceptFriendRequest(requestId: string) {
        const request = await this.friendsRepository.findFriendRequest(requestId)

        if (!request) {
            throw new Error("Invalid friend request");
        }

        const { sender, receiver } = request


        if (!sender || !receiver) {
            throw new Error("Invalid sender or receiver in friend request");
        }



        const senderId = sender.toString()
        const receiverId = receiver.toString()



        await this.friendsRepository.upsertFriends(senderId, receiverId)
        await this.friendsRepository.upsertFriends(receiverId, senderId)

        await this.friendsRepository.removeFriendRequest(requestId);
        await this.friendsRepository.removeMutualFriendRequests(senderId, receiverId);

    }




    async executeRejectFriendRequest(requestId: string) {
        await this.friendsRepository.findFriendRequestAndDelete(requestId)
    }

    async executeGetAllFriends(userId:string){
        return await this.friendsRepository.getAllFriendsByUserId(userId)
    }
}
