const makeUser = require('../../user/user');

export default function makeAddUser ({ userDb }) {
  return async function addUser (userData) {
    const user = makeUser(userData)
    const exists = await userDb.findOne({ email: user.getHash() })
    if (exists) {
      return exists
    }

    const moderated = await handleModeration({ comment })
    const commentSource = moderated.getSource()
    return commentsDb.insert({
      author: moderated.getAuthor(),
      createdOn: moderated.getCreatedOn(),
      hash: moderated.getHash(),
      id: moderated.getId(),
      modifiedOn: moderated.getModifiedOn(),
      postId: moderated.getPostId(),
      published: moderated.isPublished(),
      replyToId: moderated.getReplyToId(),
      source: {
        ip: commentSource.getIp(),
        browser: commentSource.getBrowser(),
        referrer: commentSource.getReferrer()
      },
      text: moderated.getText()
    })
  }
}
