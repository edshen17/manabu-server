function makeGetUserController ({ getUserUsecase }) {
    return async function getUser (httpRequest) {
      const headers = {
        'Content-Type': 'application/json'
      }
      try {
        const users = await getUserUsecase({
          uId: httpRequest.params.uId
        })
        return {
          headers,
          statusCode: 200,
          body: users
        }
      } catch (e) {
        // TODO: Error logging
        console.log(e)
        return {
          headers,
          statusCode: 400,
          body: {
            error: e.message
          }
        }
      }
    }
  }
  
  module.exports = { makeGetUserController };