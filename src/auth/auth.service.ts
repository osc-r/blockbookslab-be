import * as EpnsAPI from '@epnsproject/sdk-restapi';
import * as ethers from 'ethers';
import { Injectable, Logger } from '@nestjs/common';
import { generateNonce, SiweMessage } from 'siwe';
import { VerifyLoginDto } from 'src/dto/verifyLogin.dto';
import { UserRepository } from 'src/repository/user.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable({})
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

  async getNonce() {
    return generateNonce();
  }

  async verify(payload: VerifyLoginDto) {
    const { message, signature } = payload;
    const siweMessage = new SiweMessage(message);
    await siweMessage.validate(signature);

    const address = siweMessage.address.toLowerCase();
    this.logger.log(`find user for address ${address}`);
    let user = await this.userRepository.findByAddress(address);

    if (!user) {
      this.logger.log(`User not found`);

      user = await this.userRepository.createNewUser(address);
    }

    return { accessToken: this.jwtService.sign({ sub: user.id }) };
  }

  async testCreateUser(address: string) {
    return await this.userRepository.createNewUser(address);
  }
}

// async sendNotification() {
//   try {
//     const PK =
//       //delete this
//       'd0976c658b384b9e1ab5a62b95dd5d443b17f0414dce1935f60552bc713d5183'; // channel private key
//     const Pkey = `0x${PK}`;
//     const signer = new ethers.Wallet(Pkey);
//     const channel = '';
//     console.log('start');
//     const apiResponse = await EpnsAPI.payloads.sendNotification({
//       signer,
//       type: 3, // target
//       identityType: 2, // direct payload
//       notification: {
//         title: `Deposit`,
//         body: `Deposit 0.05 ETH to 0x8bdC2cEac586A3677b7d79DCdc536f546BF8FB82`,
//       },
//       payload: {
//         title: `Deposit`,
//         body: `Deposit 0.05 ETH to 0x8bdC2cEac586A3677b7d79DCdc536f546BF8FB82`,
//         cta: '',
//         img: '',
//       },
//       recipients: 'eip155:42:0x8bdC2cEac586A3677b7d79DCdc536f546BF8FB82', // recipient address
//       channel, // your channel address
//       env: 'staging',
//     });

//     // apiResponse?.status === 204, if sent successfully!
//     console.log('API repsonse: ', apiResponse, signer);
//     return apiResponse.data;
//   } catch (err) {
//     console.error('Error: ', err);
//   }
// }
