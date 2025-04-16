const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    entry: {
      app: "./src/main.ts",
      "service-worker": "./src/service-worker.ts",
    },
  },
});
