module.exports = {
  mongodb: {
    url: process.env.MONGO_URI,
    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
      useUnifiedTopology: true, // removes a deprecating warning when connecting
      // connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
      // socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
    },
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  moduleSystem: 'esm',
};
