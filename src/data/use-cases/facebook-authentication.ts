import { AccessToken } from '@/domain/models/access-token'
import { TokenGenerator } from '@/data/contracts/crypto/token'

import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos'
import { FacebookAccount } from '@/domain/models/facebook-account'

export class FacebookAuthenticationUseCase implements FacebookAuthentication {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator
  ) { }

  async execute(params: FacebookAuthentication.Parameters): Promise<FacebookAuthentication.Result> {
    const fbData = await this.facebookApi.loadUser(params)

    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: fbData.email })
      const fbAccount = new FacebookAccount(fbData, accountData)
      const { id } = await this.userAccountRepo.saveWithFacebook(fbAccount)
      const token = await this.crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
      return new AccessToken(token)
    }
    return new AuthenticationError()
  }
}
