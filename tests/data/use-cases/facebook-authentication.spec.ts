
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos'
import { FacebookAuthenticationUseCase } from '@/data/use-cases/facebook-authentication'
import { AuthenticationError } from '@/domain/errors/authentication'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationUseCase', () => {
  let loadFaceBookUserApi: MockProxy<LoadFacebookUserApi>
  let createFacebookAccountRepo: MockProxy<CreateFacebookAccountRepository>
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>

  let sut: FacebookAuthenticationUseCase
  const token = 'any_token'

  beforeEach(() => {
    loadFaceBookUserApi = mock()
    loadFaceBookUserApi.loadUser.mockResolvedValue({
      name: 'any_facebook_name',
      email: 'any_facebook_email',
      facebookId: 'any_fb_id'
    })
    loadUserAccountRepo = mock()
    createFacebookAccountRepo = mock()

    sut = new FacebookAuthenticationUseCase(loadFaceBookUserApi, loadUserAccountRepo, createFacebookAccountRepo)
  })

  it('Should call LoadFacebookUserApi with correct parameters', async () => {
    await sut.execute({ token })

    expect(loadFaceBookUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFaceBookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFaceBookUserApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.execute({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('Should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.execute({ token })

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email: 'any_facebook_email' })
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('Should call CreateUserAccountRepo when LoadUserAccountApi returns undefined', async () => {
    loadUserAccountRepo.load.mockResolvedValueOnce(undefined)

    await sut.execute({ token })

    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      email: 'any_facebook_email',
      name: 'any_facebook_name',
      facebookId: 'any_fb_id'
    })
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})
