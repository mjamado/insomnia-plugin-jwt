const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

module.exports.templateTags = [{
  name: 'jwtCreate',
  displayName: 'JSON Web Token Creator',
  description: 'Generate JSON Web Token with HS256 signature',
  args: [
    {
      displayName: 'Issuer (iss)',
      type: 'string',
      defaultValue: '',
    },
    {
      displayName: 'Subject (sub)',
      type: 'string',
      defaultValue: '',
    },
    {
      displayName: 'Audience (aud)',
      type: 'string',
      defaultValue: '',
    },
    {
      displayName: 'Not Before time in seconds from now (nbf)',
      type: 'number',
      defaultValue: 0,
    },
    {
      displayName: 'Expiration time in seconds from now (exp)',
      type: 'number',
      defaultValue: 10,
    },
    {
      displayName: 'JWT ID (jti)',
      type: 'enum',
      defaultValue: 'UUIDv4',
      options: [
        { displayName: 'Nothing', value: 'no', description: "Don't set JWT ID" },
        { displayName: 'UUIDv4', value: 'UUIDv4', description: 'Random UUIDv4' },
      ],
    },
    {
      displayName: 'Private claims (JSON format)',
      type: 'string',
      defaultValue: '{}',
    },
    {
      displayName: 'Secret for HS256',
      type: 'string',
      defaultValue: '',
    },
  ],
  async run(context, iss, sub, aud, nbf, exp, jti, more, secret) {
    const now = Math.round(Date.now() / 1000);
    const payload = JSON.parse(more); // may throw error

    if (iss) {
      payload.iss = iss;
    }

    if (sub) {
      payload.sub = sub;
    }

    if (aud) {
      payload.aud = aud;
    }

    if (nbf) {
      payload.nbf = now + nbf;
    }

    if (exp) {
      payload.exp = now + exp;
    }

    if (jti !== 'no') {
      payload.jti = uuidv4();
    }

    return jwt.sign(payload, secret);
  },
}];
