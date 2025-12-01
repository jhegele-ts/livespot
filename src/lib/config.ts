import { appConfiguration } from "../config";

if (typeof window !== "undefined")
  throw new Error(
    "Importing lib/config.ts into a client environment is insecure"
  );

export class Config {
  private _varNames = {
    tsHost: "TS_HOST",
    tsSecretKey: "TS_SECRET_KEY",
  };

  get env():
    | { useEnvironmentVars: true; host: string; secretKey: string }
    | { useEnvironmentVars: false; host: undefined; secretKey: undefined } {
    if (this.useEnvironmentVars) {
      if (!this.tsHost || !this.tsSecretKey)
        throw new Error(
          `App configured to use environment vars but ${this._varNames.tsHost} and/or ${this._varNames.tsSecretKey} are not set.`
        );
      return {
        useEnvironmentVars: true,
        host: this.tsHost,
        secretKey: this.tsSecretKey,
      };
    }
    return {
      useEnvironmentVars: false,
      host: undefined,
      secretKey: undefined,
    };
  }

  get useEnvironmentVars(): boolean {
    return appConfiguration.auth.useEnvironmentVariables;
  }

  get tsHost(): string | undefined {
    const host = process.env[this._varNames.tsHost];
    if (host === "") return undefined;
    return host;
  }

  get tsSecretKey(): string | undefined {
    const secretKey = process.env[this._varNames.tsSecretKey];
    if (secretKey === "") return undefined;
    return secretKey;
  }

  public static checkConfig = () => {
    const config = new Config();
    if (appConfiguration.auth.useEnvironmentVariables) {
      console.log("[CONFIG] Using environment variables");
      if (!config.tsHost || !config.tsSecretKey) {
        console.log(
          `[CONFIG] Could not find ${config._varNames.tsHost} or ${config._varNames.tsSecretKey} environment variables. Exiting.`
        );
        throw new Error(
          `When auth.useEnvironmentVariables is set to true you MUST set ${config._varNames.tsHost} and ${config._varNames.tsSecretKey} environment variables`
        );
      }
      console.log(
        `[CONFIG] Found ${config._varNames.tsHost} and ${config._varNames.tsSecretKey} environment variables`
      );
    } else {
      if (config.tsHost || config.tsSecretKey) {
        console.log(
          `[CONFIG] INFO: ${config._varNames.tsHost} or ${config._varNames.tsSecretKey} are set but auth.useEnvironmentVariables is false. If you want to use your environment variables, update auth.useEnvironmentVariables in the src/config.ts file.`
        );
      }
    }
  };
}

// Run checkConfig as part of runtime environment validation
Config.checkConfig();
