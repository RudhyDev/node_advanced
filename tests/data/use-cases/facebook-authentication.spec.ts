import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthenticationUseCase } from '@/data/use-cases/facebook-authentication'
import { AuthenticationError } from '@/domain/errors/authentication'

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
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
