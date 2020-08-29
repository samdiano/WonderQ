import Joi from 'joi';

const validateMessages = (message) => {
  const schema = {
    messageBody: Joi.string().min(3).trim().required()
  };
  return Joi.validate(message, schema);
};

export default validateMessages;

