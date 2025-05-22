module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  verbose: true,
  testTimeout: 30000 // Aumentamos el tiempo de espera a 30 segundos para API calls
};
