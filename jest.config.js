module.exports = {
    testEnvironment: "jsdom",
    moduleNameMapper: {
      "\\.(css|less)$": "<rootDir>/test/mocks/styleMock.js",
      "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/test/mocks/fileMock.js",
      "^firebase/(.*)$": "<rootDir>/test/mocks/firebasemock.js",
      "^@/Utils/(.*)$": "<rootDir>/src/Utils/$1"
    },
    transform: {
      "^.+\\.jsx?$": "babel-jest"
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],  // Usa setupFilesAfterEnv en lugar de setupFiles
    collectCoverage: true,
    coverageDirectory: "<rootDir>/coverage",
    coverageReporters: ["json", "lcov", "text", "clover"],
    collectCoverageFrom: [
      "src/**/*.{js,jsx}",
      "!src/index.js", // Excluir archivos específicos si es necesario
      "!src/config/**", // Excluir configuraciones específicas si es necesario
      "!src/test/**", // Excluir archivos de prueba si es necesario
    ],
  };
  