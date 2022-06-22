import { UpdateFacebookAccountRepository } from './../contracts/repos/user-account'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '../contracts/repos'

export class FacebookAuthenticationUseCase {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository

  ) { }

  async execute(parameters: FacebookAuthentication.Parameters): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(parameters)

    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: fbData.email })
      if (accountData?.name !== undefined) {
        await this.userAccountRepo.updateWithFacebook({
          id: accountData.id,
          name: accountData.name,
          facebookId: fbData.facebookId
        })
      } else {
        await this.userAccountRepo.createFromFacebook(fbData)
      }
    }

    return new AuthenticationError()
  }
}
