const Joi = require("joi");

const PostValidation = Joi.object({
  title: Joi.string().required(),
});
const UpdatePostValidation = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
});

const CommentValidation = Joi.object({
  content: Joi.string().required(),
});

module.exports = { PostValidation, CommentValidation, UpdatePostValidation };
