import ConsoleFactory from './ConsoleFactory';

(async() => {
  await ConsoleFactory.execConsole();
})().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
