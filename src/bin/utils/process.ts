export function addExitHook(callback: () => Promise<void>) {
  async function cleanup() {
    await callback();
  }

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("exit", cleanup);
}
