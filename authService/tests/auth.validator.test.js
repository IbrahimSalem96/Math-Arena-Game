const { registerSchema } = require('../validators/auth.validator');

describe('validate()', () => {
  it('should fail if missing username', () => {
    const { error } = registerSchema.validate({ name: 'A', password: '123456' });
    expect(error).toBeDefined();
  });
});
