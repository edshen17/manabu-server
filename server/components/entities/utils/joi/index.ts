import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';

const joi = Joi.extend((joi) => {
  return {
    type: 'string',
    base: joi.string(),
    rules: {
      htmlStrip: {
        validate(value) {
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
