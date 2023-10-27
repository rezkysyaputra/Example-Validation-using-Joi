import pkg from '@hapi/hapi';
import Joi from '@hapi/joi';

const Hapi = pkg;

const schema = Joi.object({
  username: Joi.string().alphanum().min(4).max(30).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
  password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
});
const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
  });

  server.route([
    {
      method: 'POST',
      path: '/',
      handler: (request, h) => {
        console.log(request.payload);
        const { error, value } = schema.validate(request.payload);

        if (!error) {
          return h
            .response({
              message: 'Data Valid',
              data: value,
            })
            .code(200);
        }

        console.log(error);
        return h.response({ message: 'Data Invalid', error }).code(400);
      },
    },
  ]);

  server.start();
  console.log(`Server is running on ${server.info.uri}`);
};

init();
