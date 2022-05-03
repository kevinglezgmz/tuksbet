module.exports = {
  target: "node",
  output: {
    path: `${process.cwd()}/dist`,
    filename: "index.js",
    libraryTarget: "umd",
  },
};
