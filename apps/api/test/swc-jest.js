// Shared @swc/jest transform (decorators + metadata for NestJS).
module.exports = {
  '^.+\\.(t|j)s$': [
    '@swc/jest',
    {
      jsc: {
        parser: { syntax: 'typescript', decorators: true },
        transform: { legacyDecorator: true, decoratorMetadata: true },
        target: 'es2023',
        keepClassNames: true,
      },
      module: { type: 'commonjs' },
    },
  ],
};
