import { HydratedDocument } from 'mongoose';
import * as mongoose from "mongoose";
import { User } from "../user/user.schema";
export type AddressDocument = HydratedDocument<Address>;
export declare class Address {
    network: string;
    content: string;
    user: User;
}
export declare const AddressSchema: mongoose.Schema<Address, mongoose.Model<Address, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Address>;
