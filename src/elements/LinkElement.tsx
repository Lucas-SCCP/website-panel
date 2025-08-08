import { useEffect, useRef, useState } from 'react';
import { Row, Col, Form, Accordion, Button, InputGroup } from 'react-bootstrap'
import { PropertiesSettings } from '../components/PropertiesSettings'
import { StylesSettings } from '../components/StylesSettings'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import { MdDeleteForever } from 'react-icons/md'
import type { WebsiteType, PageType, ComponentType, ElementType, LinkPropertiesType } from 'website-lib'

export function LinkElement({ element }: { element: ElementType }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [originalFileName, setOriginalFileName] = useState<string>('')

  const selectedWebsite: WebsiteType | null = UseWebsiteStore((state) => state.selectedWebsite)
  const selectedPage: PageType | null = UseWebsiteStore((state) => state.selectedPage)
  const component: ComponentType | undefined = selectedPage?.components.find((c) => c.id === element.component_id)

  const updatedElement = component?.elements.content.find((e) => e.id === element.id) || element

  const { updateSelectedElementField } = UseWebsiteStore()

  const properties = updatedElement.properties as LinkPropertiesType

  useEffect(() => {
    if (properties.path) {
      setOriginalFileName(properties.path)
    }
  }, [])

  const setFile = async (files: FileList | null) => {
    const file = files?.[0]

    if (file) {

      if (file.size > 2 * 1024 * 1024) {
        alert('O arquivo deve ter no máximo 2MB.')
        return
      }

      const res = await fetch(`http://api.local/files/presigned_url/${file.name}/type/${encodeURIComponent(file.type)}`)
      const response = await res.json()
      const { url, fileUrl } = response.data

      const upload = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type
        },
        body: file
      })

      if (upload.ok) {
        console.log('File uploaded successfully', fileUrl)
      } else {
        console.error('File upload failed')
      }

      setValue('path', file.name)
    }
  }

  const setValue = (key: string, file: string) => {
    if (
      file == null ||
      selectedWebsite?.id == null ||
      selectedPage?.id == null ||
      component?.id == null
    ) {
      return
    }
    updateSelectedElementField(
      component.id,
      element.id,
      'properties',
      {
        ...updatedElement.properties,
        [key]: file
      }
    )
  }

  const removerArquivo = () => {
    console.log('removerArquivo', originalFileName)
    if (inputRef.current) {
      inputRef.current.value = ''
      setValue('path', originalFileName)
    }
  }

  return (
    <Row>
      <Col lg={12}>
        <Form.Group className="mb-2" controlId="pageName">
          <Form.Label>Texto</Form.Label>
          <Form.Control type="text" placeholder="Digite o texto para o link" value={properties.title} />
        </Form.Group>
      </Col>
      <Col lg={12}>
        {properties.path && (
          <Form.Group className="mb-2" controlId="linkPath">
            <Form.Label>Arquivo atual</Form.Label>
            <InputGroup className="mb-2">
              <InputGroup.Text id="basic-addon3" style={{ width: '100%' }}>
                <a href={'https://noisdev-website-files.s3.sa-east-1.amazonaws.com/ctcleanfoodscombr/' + properties.path} target="_blank" rel="noopener noreferrer">
                  {properties.path}
                </a>
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
        )}
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>
            {properties.path && ('Selecione um arquivo para substituir o atual')}
            {!properties.path && ('Selecione um arquivo')}
          </Form.Label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ flex: '9' }}>
              <Form.Control type="file" ref={inputRef} onChange={(e) => setFile((e.target as HTMLInputElement).files)} />
            </div>
            <div style={{ flex: '1' }}>
              <Button variant="danger" size="sm" onClick={removerArquivo} style={{ width: '100%', height: '100%' }}>
                <MdDeleteForever size={24}/>
              </Button>
            </div>
          </div>
        </Form.Group>
      </Col>
      <Col lg={12}>
        <Accordion>
          <PropertiesSettings element={element} />
          <StylesSettings element={element} />
        </Accordion>
      </Col>
    </Row>
  )
}
