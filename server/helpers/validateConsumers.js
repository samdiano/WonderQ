import Joi from 'joi';

const validateConsumers = (consumer) => {
  const schema = {
    name: Joi.string().min(3).trim().required()
  };
  return Joi.validate(consumer, schema);
};

export default validateConsumers;

