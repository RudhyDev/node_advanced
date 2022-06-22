
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { CreateFacebookAccountRepository, LoadUserAccountRepository, UpdateFacebookAccountRepository } from '@/data/contracts/repos'
import { FacebookAuthenticationUseCase } from '@/data/use-cases/facebook-authentication'
import { AuthenticationError } from '@/domain/errors/authentication'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationUseCase', () => {
  let loadFaceBookUserApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository>

  let sut: FacebookAuthenticationUseCase
  const token = 'any_token'

  beforeEach(() => {
    loadFaceBookUserApi = mock()
    loadFaceBookUserApi.loadUser.mockResolvedValue({
      name: 'any_facebook_name',
      email: 'any_facebook_email',
      facebookId: 'any_fb_id'
    })
    userAccountRepo = mock()

    sut = new FacebookAuthenticationUseCase(loadFaceBookUserApi, userAccountRepo)
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

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_facebook_email' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('Should call CreateFacebookAccountRepo when LoadUserAccountApi returns undefined', async () => {
    userAccountRepo.load.mockResolvedValueOnce(undefined)

    await sut.execute({ token })

    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      email: 'any_facebook_email',
      name: 'any_facebook_name',
      facebookId: 'any_fb_id'
    })
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })

  it('Should call UpdateFacebookAccountRepo when LoadUserAccountApi returns undefined', async () => {
    userAccountRepo.load.mockResolvedValueOnce(undefined)

    await sut.execute({ token })

    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      email: 'any_facebook_email',
      name: 'any_facebook_name',
      facebookId: 'any_fb_id'
    })
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })

  it('Should call UpdateFacebookAccountRepo when LoadUserAccountApi returns data', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name'

    })

    await sut.execute({ token })

    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      facebookId: 'any_fb_id'
    })
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1)
  })
})
