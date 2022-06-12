import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'

export class FacebookAuthenticationUseCase {
  constructor(private readonly loadFacebookUserApi: LoadFacebookUserApi) { }

  async execute(parameters: FacebookAuthentication.Parameters): Promise<AuthenticationError> {
    await this.loadFacebookUserApi.loadUser(parameters)

    return new AuthenticationError()
  }
}
