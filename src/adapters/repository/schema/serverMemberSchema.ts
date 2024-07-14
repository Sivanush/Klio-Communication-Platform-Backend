import { model, ObjectId, Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

enum ServerRole {
    OWNER = 'owner',
    ADMIN = 'admin',
    MODERATOR = 'moderator',
    MEMBER = 'member'
}

interface IServerMember extends Document {
    server: ObjectId;
    userId: ObjectId;
    roles: ServerRole[];
    joinedAt: Date;
    createdAt: Date;
}

const serverMemberSchema = new Schema<IServerMember>({
    server: {
        type: Schema.Types.ObjectId,
        ref: 'Server',
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    roles: [{
        type: String,
        enum: Object.values(ServerRole),
        default: [ServerRole.MEMBER]
    }],
    joinedAt: { 
        type: Date, 
        default: Date.now 
    }
})

export const serverMemberModel = model('Server-Member', serverMemberSchema)