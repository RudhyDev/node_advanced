
import { FacebookAuthenticationUseCase } from '@/data/use-cases/facebook-authentication'
import { AuthenticationError } from '@/domain/errors/authentication'

describe('FacebookAuthenticationUseCase', () => {
  it('Should call LoadFacebookUserApi with correct parameters', async () => {
    const loadFacebookUserApi = {
      loadUser: jest.fn()
    }
    const sut = new FacebookAuthenticationUseCase(loadFacebookUserApi)

    await sut.execute({ token: 'any_token' })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApi = {
      loadUser: jest.fn()
    }
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)
    const sut = new FacebookAuthenticationUseCase(loadFacebookUserApi)

    const authResult = await sut.execute({ token: 'any_token' })

    await sut.execute({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
