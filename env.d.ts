declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      EPNS_CHANNEL: string;

      PG_HOST: string;
      PG_USERNAME: string;
      PG_PASSWORD: string;
      PG_DATABASE: string;

      REDIS_HOST: string;
      ETHERSCAN_API_KEY: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
