import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';

const startServer = async () => {
  try {
    const port = env.PORT || 3000;
    
    app.listen(port, () => {
      logger.info(`Server is running on port ${port} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error(error, 'Failed to start server');
    process.exit(1);
  }
};

startServer();
