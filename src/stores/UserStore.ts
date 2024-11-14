import { defineStore } from "pinia";
import { authServiceClient } from "../transport";
import { RpcError, UnaryCall } from "@protobuf-ts/runtime-rpc";

interface State {
  accessToken: string,
  refreshToken: string,
  displayName: string,
  username: string,
}

export class UserUndefinedError extends Error {
}

export class TokenRefreshError extends Error {
  readonly cause: any

  constructor(message: string, cause: any) {
    super(message)
    this.cause = cause
  }
}

const makeTokenRefreshError = (err: any): TokenRefreshError => {
  return new TokenRefreshError(
    "Error during token refresh",
    err,
  ) 
}

const userUndefinedError = new UserUndefinedError(
  "User is undefined"
)

export const useUserStore = defineStore("UserStore", {
  state: (): { user: State | undefined } => ({
    user: undefined
  }),
  actions: {
    signIn(username: string, password: string): Promise<void> {
	    const request = {
		    pUsername: username,
		    pRawPassword: password,
	    }

      return new Promise((resolve, reject) => {
        authServiceClient.signIn(request).then(
		      call => {
            const response = call.response;
            this.user = {
              accessToken: response.pAccessToken,
              refreshToken: response.pRefreshToken,
              displayName: response.pDisplayName,
              username: response.pUsername,
            }
            resolve()
		      },
		      err => {
			      reject(err)
		      }
	      )
      })
    },

    async withActualToken<REQUEST extends object, RESPONSE extends object>(
      action: (actualAccessToken: string) => UnaryCall<REQUEST, RESPONSE>,
    ): Promise<RESPONSE> {
      if (!this.user) {
        throw userUndefinedError
      }

      try {
        return await action(this.user.accessToken).response
      } catch (err: any) {
        if (!(err instanceof RpcError)) {
          throw err
        }

        const rpcErr = err as RpcError
        if (rpcErr.code != '16') {
          throw err
        }
      }

      const request = {
        pRefreshToken: this.user.refreshToken
      }

      try {
        const call = await authServiceClient.refreshToken(request)
        this.user.accessToken = call.response.pAccessToken
      } catch (err: any) {
        throw makeTokenRefreshError(err)
      }

      return await action(this.user.accessToken).response
    },
  } 
})