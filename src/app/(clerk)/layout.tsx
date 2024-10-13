import React from 'react'

interface ClerkLayoutProps {
    children: React.ReactNode
}

export default function ClerkLayout({children}: ClerkLayoutProps ) {
  return (
    <div className='flex items-center justify-center h-screen w-full'>{children}</div>
  )
}
