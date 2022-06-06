import { AuthenticationError } from '@/domain/errors/authentication'

import { FacebookAuthentication } from '@/domain/features'

class FacebookAuthenticationUseCase {
  constructor(private readonly loadFacebookUserApi: LoadFacebookUser) { }

  async execute(paramenters: FacebookAuthentication.Parameters): Promise<AuthenticationError> {
    await this.loadFacebookUserApi.loadUser(paramenters)
    return new AuthenticationError()
  }
}

interface LoadFacebookUser {
  loadUser: (parameters: LoadFacebookUserApi.Parameters) => Promise<LoadFacebookUserApi.Result>
}

export namespace LoadFacebookUserApi {
  export type Parameters = {
    token: string
  }

  export type Result = undefined
}

class LoadFacebookUserApiSpy implements LoadFacebookUser {
  token?: string
  result: undefined

  async loadUser(parameters: LoadFacebookUserApi.Parameters): Promise<LoadFacebookUserApi.Result> {
    this.token = parameters.token
    return this.result
  }
}

describe('FacebookAuthenticationUseCase', () => {
  it('Should call LoadFacebookUserApi with correct parameters', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationUseCase(loadFacebookUserApi)

    await sut.execute({ token: 'any_token' })

    expect(loadFacebookUserApi.token).toBe('any_token')
  })

  it('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    loadFacebookUserApi.result = undefined
    const sut = new FacebookAuthenticationUseCase(loadFacebookUserApi)

    const authResul = await sut.execute({ token: 'any_token' })

    await sut.execute({ token: 'any_token' })

    expect(authResul).toEqual(new AuthenticationError())
  })
})
