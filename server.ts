import Bootstrap from './src/bootstrap';

const bootstrap = new Bootstrap();
bootstrap.start().catch((error) => {
  console.error("Error starting the server:", error);
  process.exit(1);
});