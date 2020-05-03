import { StringUtils } from './StringUtils';

describe('StringUtils', () => {
  describe('capitalize', () => {
    it('should capitalize the given string', () => {
      const capitalized = StringUtils.capitalize('test value');
      expect(capitalized).toEqual('Test value');
    });
  });

  describe('capitalizeWords', () => {
    it('should capitalize the given string', () => {
      const capitalizedWords = StringUtils.capitalizeWords('test value');
      expect(capitalizedWords).toEqual('Test Value');
    });
  });

  describe('hyphenize', () => {
    it('should hyphenize the given string', () => {
      const hyphenized = StringUtils.hyphenize('test value');
      expect(hyphenized).toEqual('test-value');
    });
  });

  describe('camelize', () => {
    it('should camelize the given string', () => {
      const camelized = StringUtils.camelize('test value');
      expect(camelized).toEqual('testValue');
    });
  });

  describe('decamelize', () => {
    it('should camelize the given string', () => {
      const decamelized = StringUtils.decamelize('testValue');
      expect(decamelized).toEqual('test value');
    });
  });
});
