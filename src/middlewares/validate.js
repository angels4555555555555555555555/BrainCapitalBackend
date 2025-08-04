export const validate = (schema, property = 'body') => {
    return (req, res, next) => {
      const dataToValidate = req[property];
      const { error, value } = schema.validate(dataToValidate, { abortEarly: false, stripUnknown: true });
      if (error) {
        return res.status(400).json({ message: error.details.map(d => d.message) });
      }
      req[property] = value; // sanitized data
      next();
    };
};