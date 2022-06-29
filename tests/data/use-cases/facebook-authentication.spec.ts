import { AccessToken } from '@/domain/models/access-token'

import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos'
import { FacebookAuthenticationUseCase } from '@/data/use-cases/facebook-authentication'
import { AuthenticationError } from '@/domain/errors/authentication'
import { mock, MockProxy } from 'jest-mock-extended'
import { FacebookAccount } from '@/domain/models/facebook-account'
import { TokenGenerator } from '@/data/contracts/crypto'

jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationUseCase', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let crypto: MockProxy<TokenGenerator>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let sut: FacebookAuthenticationUseCase
  let token: string

  beforeAll(() => {
    token = 'any_token'
    facebookApi = mock()

    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_facebook_email',
      facebookId: 'any_fb_id'
    })

    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })

    crypto = mock()
    crypto.generateToken.mockResolvedValue('any_generated_token')
  })

  beforeEach(() => {
    sut = new FacebookAuthenticationUseCase(facebookApi, userAccountRepo, crypto) // aqui vc está injetando o mock no service
  })

  it('Should call LoadFacebookUserApi with correct parameters', async () => {
    await sut.execute({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.execute({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('Should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.execute({ token })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_facebook_email' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('Should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }))
    jest.mocked(FacebookAccount).mockImplementation(FacebookAccountStub)

    await sut.execute({ token })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('Should call TokenGenerator with correct params', async () => {
    await sut.execute({ token })

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })

  it('Should return an AccesToken on success', async () => {
    const authResult = await sut.execute({ token })

    expect(authResult).toEqual(new AccessToken('any_generated_token'))
  })

  it('Should rethrow if LoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'))

    const promise = sut.execute({ token })

    await expect(promise).rejects.toThrow(new Error('fb_error'))
  })

  it('Should rethrow if LoadUserAccountRepository throws', async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'))

    const promise = sut.execute({ token })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  it('Should rethrow if SaveFacebookAccountRepository throws', async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))

    const promise = sut.execute({ token })

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  it('Should rethrow if TokenGenerator throws', async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error('token_error'))

    const promise = sut.execute({ token })

    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
