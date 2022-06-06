import { AccessToken } from '@/domain/models/access-token'
import { AuthenticationError } from '@/domain/errors/authentication'

export interface FacebookAuthentication {
  execute: (parameters: FacebookAuthentication.Parameters) => Promise<FacebookAuthentication.Result>
}

namespace FacebookAuthentication {
  export type Parameters = {
    token: string
  }

  export type Result = AccessToken | AuthenticationError
}
