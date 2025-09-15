import React from 'react'
// import { Menu } from '../components/Menu'
import { Container } from 'react-bootstrap'

export function Main({ children }: { children: React.ReactNode }) {
  return (
    <Container fluid>
      {/* <Menu /> */}
      {children}
    </Container>
  )
}
