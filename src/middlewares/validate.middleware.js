export const validate = (Bodyschema, QuerySchema) => {
  return (req, res, next) => {
    const { error: BodyError } = Bodyschema?.validate({
      body: req.body,
    }, {
      abortEarly: false,
    });
    const { error: QueryError } = QuerySchema?.validate(req.query, {
      abortEarly: false,
    });

    // Combine both errors into one object
    const error = { ...BodyError, ...QueryError };

    // If there are errors
    if (error?.details?.length) {
      // Modify the error details to remove everything before the actual error message and backslashes
      const modifiedDetails = error.details.map(d => {
        let modifiedMessage = d.message.replace(/^.*?"body\.(.*?)"/, '$1'); // Remove everything before the error message
        modifiedMessage = modifiedMessage.replace(/\\/g, ''); // Remove backslashes
        return modifiedMessage;
      });

      // Send the modified error details in the response
      return res.status(400).json({
        message: modifiedDetails,
      });
    } else {
      // If no errors, proceed to the next middleware
      next();
    }
  };
};
