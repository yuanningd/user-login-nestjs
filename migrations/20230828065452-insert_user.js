module.exports = {
  async up(db, client) {
    // Insert a new user following the schema
    await db.collection('users').insertOne({
      username: 'test-user',
      password: 'password', // Make sure to hash the password before storing it
      attempts: 0,
      firstAttempt: null,
      isLocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },

  async down(db, client) {
    // Remove the user
    await db.collection('user').deleteOne({ username: 'test-user' });
  },
};
