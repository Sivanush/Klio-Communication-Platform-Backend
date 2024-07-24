import mongoose, { Document, model, Model, ObjectId, Schema } from "mongoose";

interface inviteI extends Document {
    inviteCode: string,
    serverId: string
    createdBy: string
    expiredAt: Date
    isUsed: boolean
}


const inviteSchema = new Schema<inviteI>({
    inviteCode: {
        type: String,
        // required: true,
        // index: true,
        // unique: true
    },
    serverId: {
        type: mongoose.Schema.Types.String,
        ref: 'Server',
        required: true
    },
    expiredAt: {
        type: Date,
        required: true,
        // index: true
    },
    isUsed: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true  
});

// inviteSchema.index({ inviteCode: 1, expiredAt: 1 }, { unique: true });

export const inviteModel = model<inviteI>('Invite-Code', inviteSchema)

export async function removeOldInvites(): Promise<void> {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    try {
        const result = await inviteModel.deleteMany({
            createdAt: { $lt: twoDaysAgo }
        });
        console.log(`Removed ${result.deletedCount} invites older than 2 days`);
    } catch (error) {
        console.error('Error removing old invites:', error);
    }
}