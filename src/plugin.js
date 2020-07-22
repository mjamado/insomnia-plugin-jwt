const fs = require('fs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

module.exports.templateTags = [{
  name: 'jwtCreate',
  displayName: 'JSON Web Token Creator',
  description: 'Generate JSON Web Token with signature',
  args: [
    {
      displayName: 'Algorithm',
      type: 'enum',
      defaultValue: 'HS256',
      options: [
        { displayName: 'HS256', value: 'HS256', description: 'HMAC using SHA-256 hash algorithm' },
        { displayName: 'HS384', value: 'HS384', description: 'HMAC using SHA-384 hash algorithm' },
        { displayName: 'HS512', value: 'HS512', description: 'HMAC using SHA-512 hash algorithm' },
        { displayName: 'RS256', value: 'RS256', description: 'RSASSA-PKCS1-v1_5 using SHA-256 hash algorithm' },
        { displayName: 'RS384', value: 'RS384', description: 'RSASSA-PKCS1-v1_5 using SHA-384 hash algorithm' },
        { displayName: 'RS512', value: 'RS512', description: 'RSASSA-PKCS1-v1_5 using SHA-512 hash algorithm' },
        { displayName: 'PS256', value: 'PS256', description: 'RSASSA-PSS using SHA-256 hash algorithm' },
        { displayName: 'PS384', value: 'PS384', description: 'RSASSA-PSS using SHA-384 hash algorithm' },
        { displayName: 'ES256', value: 'ES256', description: 'ECDSA using P-256 curve and SHA-256 hash algorithm' },
        { displayName: 'ES384', value: 'ES384', description: 'ECDSA using P-384 curve and SHA-384 hash algorithm' },
        { displayName: 'ES512', value: 'ES512', description: 'ECDSA using P-521 curve and SHA-512 hash algorithm' },
        { displayName: 'none', value: 'none', description: 'No digital signature or MAC value included' },
      ],
    },
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
      encoding: 'base64',
    },
    {
      displayName: 'Header (JSON format)',
      type: 'string',
      defaultValue: '{}',
    },
    {
      displayName: 'Secret',
      type: 'string',
      defaultValue: '',
    },
    {
      displayName: 'Private Key File Path (has precedence over "Secret")',
      type: 'string',
      defaultValue: '',
    },
  ],
  async run(
    context,
    algorithm,
    iss,
    sub,
    aud,
    nbf,
    exp,
    jti,
    more,
    secret,
    headerJson,
    privateKey,
  ) {
    const now = Math.round(Date.now() / 1000);
    const payload = JSON.parse(more); // may throw error
    let header;

    try {
      header = JSON.parse(headerJson);
    } catch (ex) {
      header = {};
    }

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

    if (privateKey !== '') {
      const privateKeyContent = fs.readFileSync(privateKey);

      return jwt.sign(payload, privateKeyContent, { algorithm, header });
    }

    return jwt.sign(payload, secret, { algorithm, header });
  },
}];
