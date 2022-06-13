import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository } from '../contracts/repos'

export class FacebookAuthenticationUseCase {
  constructor(private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUseAccountRepo: LoadUserAccountRepository) { }

  async execute(parameters: FacebookAuthentication.Parameters): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserApi.loadUser(parameters)

    if (fbData !== undefined) {
      await this.loadUseAccountRepo.load({ email: fbData?.email })
    }

    return new AuthenticationError()
  }
}
