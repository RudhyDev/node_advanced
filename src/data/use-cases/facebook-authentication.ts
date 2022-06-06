import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'

export class FacebookAuthenticationUseCase {
  constructor(private readonly loadFacebookUserApi: LoadFacebookUserApi) { }

  async execute(paramenters: FacebookAuthentication.Parameters): Promise<AuthenticationError> {
    await this.loadFacebookUserApi.loadUser(paramenters)
    return new AuthenticationError()
  }
}
