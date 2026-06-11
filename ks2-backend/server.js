import app from './app.js';
import db from './models/index.js';

const port = Number(process.env.PORT) || 3000;

try {
  await db.sequelize.authenticate();
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
} catch (error) {
  console.error(`Failed to start server: ${error.message}`);
  process.exit(1);
}
