module.exports = {
  apps: [
    {
      name: "JCWDOL00802", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 8802,
      },
      time: true,
    },
  ],
};
