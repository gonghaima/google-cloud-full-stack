// user.test.js
import { getUserById } from '../user'; // Import the function

describe('User collection', () => {
  it('should return the user data for a valid user_name', async () => {
    const id = 's343543543530'; // Replace with a valid user_name in your Firestore for testing

    try {
      const user = await getUserById(id);

      // Check if the user has the expected properties
      expect(user).toHaveProperty('id', id);
      expect(user).toHaveProperty('user_name');
      expect(user).toHaveProperty('password');
      expect(user).toHaveProperty('image_url');

      // Additional assertions can be made based on expected user data
      console.log('User fetched:', user);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error; // Rethrow to make sure the test fails in case of an error
    }
  });
});
