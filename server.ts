import Logger from '@utils/Logger';
import Bootstrap from './src/bootstrap';

const bootstrap = new Bootstrap();
bootstrap.start().catch((error) => {
  Logger.logError("Error starting the server", error);
  process.exit(1);
});
