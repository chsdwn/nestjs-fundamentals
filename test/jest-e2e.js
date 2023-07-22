const { join } = require('path');

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    'src/(.*)': join(__dirname, '..', 'src') + '/$1',
  },
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testRunner: 'jasmine2',
};
