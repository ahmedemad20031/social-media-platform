const Joi = require("joi");

const MessageValidation = Joi.object({
  content: Joi.string().required().min(5),
  chat: Joi.string().required(),
});

module.exports = { MessageValidation };
