const { assert } = require('chai');
const jwt = require('jsonwebtoken');
const { templateTags: [plugin] } = require('../src/plugin');

const secret = 'leSecret';

describe('Test plugin', () => {
  it('Generates bare token', (done) => {
    // (context, algorithm, iss, sub, aud, nbf, exp, jti, more, secret)
    plugin.run(null, 'HS256', '', '', '', '', '', '', '{}', secret)
      .then((token) => {
        const decodedToken = jwt.verify(token, secret);
        assert.property(decodedToken, 'iat');
        assert.isAtLeast(decodedToken.iat, Math.floor(Date.now() / 1000));

        done();
      });
  });

  it('Generates with custom payload', (done) => {
    plugin.run(null, 'HS256', '', '', '', '', '', '', '{"test": "test"}', secret)
      .then((token) => {
        const decodedToken = jwt.verify(token, secret, { algorithms: ["HS256"] });
        assert.property(decodedToken, 'iat');
        assert.isAtLeast(decodedToken.iat, Math.floor(Date.now() / 1000));
        assert.property(decodedToken, 'test');
        assert.strictEqual(decodedToken.test, 'test');

        done();
      });
  })
});
