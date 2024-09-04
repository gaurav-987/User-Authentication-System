const login = async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    try {
      const userRef = db.collection('users').doc(username);
      const doc = await userRef.get();

      if (!doc.exists) {
        res.status(404).json({ error: 'User not found' });
      } else {
        const userData = doc.data();
        const hashedPassword = userData.password;

        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (isMatch) {
          res.status(200).json({ message: 'Login successful!' });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};
