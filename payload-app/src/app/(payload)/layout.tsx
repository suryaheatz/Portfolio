import type { ReactNode } from 'react'
import config from '@payload-config'
import { RootLayout } from '@payloadcms/next/layouts'
import { importMap } from './admin/importMap'
import '@payloadcms/next/css'

export default function Layout({ children }: { children: ReactNode }) {
  return RootLayout({ children, config, importMap })
}
