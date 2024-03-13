module.exports = {
    rootDir: './',
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    setupFilesAfterEnv: [],
    transform: {
        '.+\\.(t|j)sx?$': 'ts-jest'
    },
    transformIgnorePatterns: [
        '.+/node_modules/(?!55tec_integration_lib/).*'
    ],
    testRegex: '(/__test__/.*\\.(j|t)sx?)$',
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node'
    ]
};
