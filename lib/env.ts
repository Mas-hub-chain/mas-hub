/**
 * Environment variable validation utility
 * Ensures all required environment variables are present and properly formatted
 */

type EnvVar = {
  name: string
  required: boolean
  pattern?: RegExp
  errorMessage?: string
}

const envVars: EnvVar[] = [
  {
    name: "NEXT_PUBLIC_SUPABASE_URL",
    required: true,
    pattern: /^https:\/\/.+\.supabase\.co$/,
    errorMessage: "Must be a valid Supabase URL (https://*.supabase.co)",
  },
  {
    name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    required: true,
    pattern: /^eyJ[A-Za-z0-9_-]{2,}$/,
    errorMessage: "Must be a valid Supabase anon key",
  },
  {
    name: "MASCHAIN_API_URL",
    required: true,
    pattern: /^https:\/\/.+/,
    errorMessage: "Must be a valid HTTPS URL",
  },
  {
    name: "MASCHAIN_CLIENT_ID",
    required: true,
  },
  {
    name: "MASCHAIN_CLIENT_SECRET",
    required: true,
  },
  {
    name: "MASCHAIN_NETWORK",
    required: true,
    pattern: /^(testnet|mainnet)$/,
    errorMessage: "Must be either 'testnet' or 'mainnet'",
  },
]

/**
 * Validates all required environment variables
 * @returns Array of error messages, empty if all variables are valid
 */
export function validateEnv(): string[] {
  const errors: string[] = []

  for (const envVar of envVars) {
    const value = process.env[envVar.name]

    if (envVar.required && (!value || value.trim() === "")) {
      errors.push(`${envVar.name} is required but not set`)
      continue
    }

    if (value && envVar.pattern && !envVar.pattern.test(value)) {
      errors.push(`${envVar.name}: ${envVar.errorMessage || "Invalid format"}`)
    }
  }

  return errors
}

/**
 * Gets an environment variable with validation
 * @param name Environment variable name
 * @param required Whether the variable is required
 * @returns The environment variable value
 * @throws Error if the variable is required but not set
 */
export function getEnv(name: string, required = true): string {
  const value = process.env[name]

  if (required && (!value || value.trim() === "")) {
    throw new Error(`Environment variable ${name} is required but not set`)
  }

  return value || ""
}

/**
 * Gets the MasChain network from environment variables
 * @returns "testnet" or "mainnet"
 */
export function getMasChainNetwork(): "testnet" | "mainnet" {
  const network = process.env.MASCHAIN_NETWORK || "testnet"
  return network === "mainnet" ? "mainnet" : "testnet"
}

/**
 * Logs environment validation errors during build/startup
 */
export function checkEnvDuringBuild(): void {
  if (process.env.NODE_ENV === "development") {
    const errors = validateEnv()
    if (errors.length > 0) {
      console.warn("⚠️ Environment variable issues detected:")
      errors.forEach((error) => console.warn(`  - ${error}`))
      console.warn("These issues may cause the application to malfunction.")
    }
  }
}
