export interface Environment {
  NEXT_PUBLIC_APP_NAME: string
  NEXT_PUBLIC_APP_URL: string
  NODE_ENV: 'development' | 'production' | 'test'
  DATABASE_URL?: string
  AUTH_SECRET?: string
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Environment {}
  }
}

export {}