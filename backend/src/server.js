import app from './app.js';
import { config } from './config/env.js';

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 SDN 2 Tegalsari Backend Server running!`);
  console.log(`🌐 Environment : ${config.nodeEnv}`);
  console.log(`🔗 Local URL   : http://localhost:${PORT}`);
  console.log(`🛡️  DevSecOps  : Helmet, CORS Strict, Rate Limit ACTIVE`);
  console.log(`===================================================`);
});

// Graceful Shutdown Handling for DevSecOps & Containerization
const gracefulShutdown = (signal) => {
  console.log(`\n[${signal}] Received. Menutup server secara aman...`);
  server.close(() => {
    console.log('✅ Server HTTP ditutup dengan aman.');
    process.exit(0);
  });

  // Force close if graceful shutdown times out (10s)
  setTimeout(() => {
    console.error('⚠️ Penutupan paksa karena timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, _promise) => {
  console.error('[Unhandled Rejection] Alasan:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[Uncaught Exception] Error:', error);
  process.exit(1);
});
