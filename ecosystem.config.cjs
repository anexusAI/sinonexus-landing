module.exports = {
  apps: [
    {
      name: 'sinonexus-production',
      script: 'server.ts',
      interpreter: 'node',
      interpreter_args: '--import tsx',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Restart logic
      exp_backoff_restart_delay: 100,
      max_memory_restart: '800M',
      // Logging
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }
  ]
};
