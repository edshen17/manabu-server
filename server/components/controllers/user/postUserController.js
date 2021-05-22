function makePostUserController({ postUserUsecase }) {
  return async function createUser(httpRequest) {
    try {
      const userData = {
        ...httpRequest.body,
      };
      const newUser = await postUserUsecase({ userData });
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 201,
        body: { newUser },
      };
    } catch (e) {
      // TODO: Error logging
      console.log(e);
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 500,
        body: {
          error: e.message,
        },
      };
    }
  };
}

module.exports = { makePostUserController };
