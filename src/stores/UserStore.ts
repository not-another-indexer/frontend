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

const LOCAL_STORAGE_KEY = "NAI_USER_TOKEN"

interface LocalStorageData {
  refreshToken: string,
  displayName: string,
  username: string,
}

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

            const localStorageData: LocalStorageData = {
              refreshToken: response.pRefreshToken,
              displayName: response.pDisplayName,
              username: response.pUsername,
            }

            localStorage[LOCAL_STORAGE_KEY] = JSON.stringify(localStorageData)
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
        const value = JSON.parse(localStorage[LOCAL_STORAGE_KEY])
        if (!isLocalStorageData(value)) {
          throw userUndefinedError
        }
        const data = value as LocalStorageData
        
        const accessToken = await refreshTokenAction(data.refreshToken)
        this.user = {
          accessToken: accessToken,
          refreshToken: data.refreshToken,
          displayName: data.displayName,
          username: data.username,
        }
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

      this.user.accessToken = await refreshTokenAction(this.user.refreshToken)

      return await action(this.user.accessToken).response
    },
  } 
})

const isLocalStorageData = (data: any): data is LocalStorageData => {
  const localStorageData = data as LocalStorageData
  return localStorageData.displayName !== undefined && 
      localStorageData.refreshToken !== undefined && 
      localStorageData.username !== undefined
}

const refreshTokenAction = async (refreshTokenValue: string): Promise<string> => {
  const request = {
    pRefreshToken: refreshTokenValue,
  }

  try {
    const call = await authServiceClient.refreshToken(request)
    return call.response.pAccessToken
  } catch (err: any) {
    throw makeTokenRefreshError(err)
  }
}