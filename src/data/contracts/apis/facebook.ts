export interface LoadFacebookUserApi {
  loadUser: (parameters: LoadFacebookUserApi.Parameters) => Promise<LoadFacebookUserApi.Result>
}

export namespace LoadFacebookUserApi {
  export type Parameters = {
    token: string
  }

  export type Result = undefined | {
    name: string
    email: string
    facebookId: string
  }
}
