
import { Schema, model, Document, Types } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    server: Types.ObjectId;
    createdAt: Date;
}

const CategorySchema = new Schema<ICategory>({
    name: { 
        type: String,
        required: true 
    },
    server: {
        type: Schema.Types.ObjectId,
        ref: 'Server',
        required: true
    }
},{
    timestamps:true
})

export const categoryModel = model<ICategory>('Category', CategorySchema);