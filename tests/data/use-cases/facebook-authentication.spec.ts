
import { FacebookAuthentication } from '@/domain/features'

class FacebookAuthenticationUseCase {
  constructor(private readonly loadFacebookUserApi: LoadFacebookUser) { }

  async execute(paramenters: FacebookAuthentication.Parameters): Promise<void> {
    await this.loadFacebookUserApi.loadUser(paramenters)
  }
}

interface LoadFacebookUser {
  loadUser: (parameters: LoadFacebookUserApi.Parameters) => Promise<void>
}

export namespace LoadFacebookUserApi {
  export type Parameters = {
    token: string
  }
}

class LoadFacebookUserApiSpy implements LoadFacebookUser {
  token?: string
  async loadUser(parameters: LoadFacebookUserApi.Parameters): Promise<void> {
    this.token = parameters.token
  }
}

describe('FacebookAuthenticationUseCase', () => {
  it('Should call LoadFacebookUserApi with correct parameters', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationUseCase(loadFacebookUserApi)

    await sut.execute({ token: 'any_token' })

    expect(loadFacebookUserApi.token).toBe('any_token')
  })
})
