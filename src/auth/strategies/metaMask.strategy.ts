import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';
import { ethers } from 'ethers';

// @Injectable()
// export class MetaMaskStrategy extends PassportStrategy(Strategy, 'metamask') {
//     constructor(){
//         super({
//             passReqtToCallback: true,
//         })
//     }

//     async validate(req:Request,address:string, signature:string): Promise<any> {
        