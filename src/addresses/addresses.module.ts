import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { MongooseModule } from "@nestjs/mongoose";
import { Address, AddressSchema } from "./address.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }])
  ],
  providers: [AddressesService]
})
export class AddressesModule {}
