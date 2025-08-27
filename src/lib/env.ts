import { loadEnvConfig } from '@next/env'

const projectDir = process.cwd()
loadEnvConfig(projectDir)

export const SERVER_API_KEY = process.env.API_KEY;
export const CLIENT_API_TCP_KEY = process.env.NEXT_PUBLIC_API_TCP_KEY;