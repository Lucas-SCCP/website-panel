import React from 'react'
import { Menu } from '../components/Menu'
import { Container } from 'react-bootstrap'

type MainProps = {
  children: React.ReactNode
}

const Main: React.FC<MainProps> = ({ children }) => {
  return (
    <Container fluid>
      <Menu />
      {children}
    </Container>
  )
}

export default Main
