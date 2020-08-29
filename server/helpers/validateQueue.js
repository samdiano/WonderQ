import Joi from 'joi';

const validateQueue = (queue) => {
  const schema = {
    name: Joi.string().min(3).trim().required()
  };
  return Joi.validate(queue, schema);
};

export default validateQueue;

