const Joi = require('joi-oid');
import sanitizeHtml from 'sanitize-html';

const joi = Joi.extend((joi: any) => {
  return {
    type: 'string',
    base: joi.string(),
    rules: {
      htmlStrip: {
        validate(value: any) {
          return sanitizeHtml(value, {
            allowedTags: [],
            allowedAttributes: {},
          });
        },
      },
    },
  };
});

export { joi };
