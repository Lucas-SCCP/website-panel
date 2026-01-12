import { useEffect, useState } from 'react'
import { Row, Col, Button, Form, Modal, Spinner, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Main } from './Main'
import { LiaBookSolid, LiaEditSolid, LiaPlusSolid, LiaSave, LiaTrashAlt } from 'react-icons/lia'
import { FaTrash, FaInfoCircle } from 'react-icons/fa'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import { UseUserStore } from '../stores/UseUserStore'
import { ApiService } from '../services/ApiService'
import type { PostType, CreatePostData, UpdatePostData } from '../types/PostsType'

export function Posts() {
  const setSelectedPageId = UseWebsiteStore((state) => state.setSelectedPageId)
  const selectedWebsite = UseWebsiteStore((state) => state.selectedWebsite)
  const token = UseUserStore((state) => state.token)
  
  const [posts, setPosts] = useState<PostType[]>([])
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [postToDelete, setPostToDelete] = useState<PostType | null>(null)
  
  // Form fields
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [slug, setSlug] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [images, setImages] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')

  console.log('Posts component rendered, selectedWebsite:', selectedWebsite)

  const loadPosts = async () => {
    if (!selectedWebsite) {
      console.log('No website selected')
      setPosts([])
      return
    }
    
    console.log('Loading posts for website:', selectedWebsite.id)
    setLoading(true)
    setError(null)
    try {
      const apiService = new ApiService()
      const postsData = await apiService.getPostsByWebsiteId(selectedWebsite.id)
      console.log('Posts carregados:', postsData)
      setPosts(postsData || [])
    } catch (err) {
      console.error('Erro ao carregar posts:', err)
      setError('Erro ao carregar posts')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('useEffect triggered')
    setSelectedPageId(null)
    if (selectedWebsite) {
      loadPosts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWebsite?.id])

  const handleSelectPost = (post: PostType) => {
    setSelectedPost(post)
    setIsCreatingNew(false)
    setTitle(post.title)
    setText(post.text)
    setSlug(post.slug)
    setStatus(post.status)
    setImages(post.images || [])
    setError(null)
    setSuccess(null)
  }

  const handleNewPost = () => {
    setIsCreatingNew(true)
    setSelectedPost(null)
    setTitle('')
    setText('')
    setSlug('')
    setStatus('draft')
    setImages([])
    setError(null)
    setSuccess(null)
  }

  const handleSavePost = async () => {
    if (!selectedWebsite || !token) return
    
    if (!title.trim() || !text.trim()) {
      setError('Título e texto são obrigatórios')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const apiService = new ApiService()
      const imagesArray = images.length > 0 ? images : null

      if (isCreatingNew) {
        // Create new post
        const postData: CreatePostData = {
          website_id: selectedWebsite.id,
          title: title.trim(),
          text: text.trim(),
          slug: slug.trim() || undefined,
          images: imagesArray,
          status
        }
        
        await apiService.createPost(postData, token)
        setSuccess('Post criado com sucesso!')
        setIsCreatingNew(false)
      } else if (selectedPost) {
        // Update existing post
        const updates: UpdatePostData = {
          title: title.trim(),
          text: text.trim(),
          slug: slug.trim() || undefined,
          images: imagesArray,
          status
        }
        
        await apiService.updatePost(selectedPost.id, updates, token)
        setSuccess('Post atualizado com sucesso!')
      }

      // Reload posts
      await loadPosts()
      
      // Clear form after a delay
      setTimeout(() => {
        setTitle('')
        setText('')
        setSlug('')
        setStatus('draft')
        setImages([])
        setSelectedPost(null)
        setIsCreatingNew(false)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar post')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async () => {
    if (!postToDelete || !token) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const apiService = new ApiService()
      await apiService.deletePost(postToDelete.id, token)
      setSuccess('Post deletado com sucesso!')
      setShowDeleteModal(false)
      setPostToDelete(null)
      
      // Clear form if deleted post was selected
      if (selectedPost?.id === postToDelete.id) {
        setSelectedPost(null)
        setTitle('')
        setText('')
        setSlug('')
        setStatus('draft')
        setImages([])
      }

      // Reload posts
      await loadPosts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar post')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = (post: PostType) => {
    setPostToDelete(post)
    setShowDeleteModal(true)
  }

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newImageUrls: string[] = []
    Array.from(files).forEach(file => {
      // Cria URL temporária para preview
      const imageUrl = URL.createObjectURL(file)
      newImageUrls.push(imageUrl)
    })

    setImages([...images, ...newImageUrls])
  }

  const handleRemoveImage = (index: number) => {
    const imageToRemove = images[index]
    // Libera memória da URL temporária
    if (imageToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove)
    }
    setImages(images.filter((_, i) => i !== index))
  }

  console.log('About to render, posts:', posts.length, 'loading:', loading)

  // Filter posts by status
  const filteredPosts = Array.isArray(posts) ? posts.filter(post => {
    if (filterStatus === 'all') return true
    return post.status === filterStatus
  }) : []

  return (
    <Main>
      <Row className="mt-3 mb-3">
        <Col sm={12} md={12} lg={12}>
          <div className="website-card">
            <Row>
              <Col lg={12} className="mb-2">
                <div className="website-card-header tiktok-sans fw-100" style={{ fontSize: '20px' }}>
                  <LiaBookSolid size={24} />
                  <b>GESTÃO DE POSTS</b>
                </div>
              </Col>
              
              {!selectedWebsite ? (
                <Col lg={12}>
                  <div className="text-center text-muted py-5">
                    <LiaBookSolid size={64} opacity={0.3} />
                    <p className="mt-3">Selecione um website para gerenciar posts</p>
                  </div>
                </Col>
              ) : (
              <Col lg={12}>
                <Row>
                  <Col lg={4} className='pe-0'>
                    <div style={{ border: '1px solid var(--blue1)', borderRadius: '8px', padding: '10px' }}>
                      <Row>
                        <Col lg={12} className='mb-3 text-center'>
                          <Button 
                            onClick={handleNewPost}
                            style={{ 
                              background: 'var(--blue3)', 
                              border: 'none',
                              borderRadius: '8px', 
                              padding: '10px',
                              width: '100%',
                              fontWeight: 'bold',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                              transition: 'all 0.2s'
                            }}
                            disabled={loading}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)'
                              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)'
                              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            <LiaPlusSolid className="me-2" />
                            CRIAR NOVO POST
                          </Button>
                        </Col>
                        
                        <Col lg={12} className='mb-3'>
                          <Form.Select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            <option value="all">Todos os posts</option>
                            <option value="published">Publicados</option>
                            <option value="draft">Rascunhos</option>
                          </Form.Select>
                        </Col>
                        
                        {loading && (!Array.isArray(posts) || posts.length === 0) ? (
                          <Col lg={12} className="text-center">
                            <Spinner animation="border" size="sm" />
                          </Col>
                        ) : (
                          <Col lg={12} style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {filteredPosts.map((post) => (
                              <div 
                                key={post.id} 
                                className='mb-3'
                                style={{ 
                                  border: selectedPost?.id === post.id ? '2px solid var(--blue3)' : '1px solid var(--blue1)', 
                                  borderRadius: '8px', 
                                  padding: '12px',
                                  cursor: 'pointer',
                                  backgroundColor: selectedPost?.id === post.id ? 'rgba(0, 123, 255, 0.05)' : 'transparent',
                                  transition: 'all 0.2s',
                                  boxShadow: selectedPost?.id === post.id ? '0 2px 8px rgba(0, 123, 255, 0.15)' : 'none'
                                }}
                                onClick={() => handleSelectPost(post)}
                              >
                                <div>
                                  <div style={{ fontWeight: 'bold' }}>
                                    {post.title}
                                  </div>
                                  
                                  <div style={{ 
                                    display: 'flex', 
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                  }}>
                                    <div style={{ 
                                      fontSize: '0.75em', 
                                      color: '#666',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}>
                                      {(() => {
                                        try {
                                          // Handle date object from API (PHP format)
                                          const dateValue = typeof post.createdAt === 'object' && post.createdAt !== null && 'date' in post.createdAt
                                            ? post.createdAt.date 
                                            : post.createdAt
                                          
                                          const date = new Date(dateValue as string)
                                          if (isNaN(date.getTime())) {
                                            return String(dateValue)
                                          }
                                          return date.toLocaleString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })
                                        } catch {
                                          return String(post.createdAt)
                                        }
                                      })()}
                                    </div>
                                    
                                    <div>
                                      <span style={{ 
                                        fontSize: '0.7em',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        backgroundColor: post.status === 'published' ? '#28a745' : '#ffc107',
                                        color: post.status === 'published' ? 'white' : '#333',
                                        fontWeight: '500'
                                      }}>
                                        {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {filteredPosts.length === 0 && !loading && (
                              <div className="text-center text-muted p-4" style={{
                                border: '2px dashed var(--blue1)',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(0, 123, 255, 0.02)'
                              }}>
                                <LiaBookSolid size={56} opacity={0.2} className="mb-3" />
                                <p className="mb-2" style={{ fontSize: '0.95em', fontWeight: '500' }}>
                                  {filterStatus === 'all' 
                                    ? 'Nenhum post encontrado' 
                                    : `Nenhum post ${filterStatus === 'published' ? 'publicado' : 'em rascunho'}`
                                  }
                                </p>
                                <small style={{ fontSize: '0.85em' }}>
                                  {filterStatus === 'all' 
                                    ? (<>Clique em <b>"CRIAR NOVO POST"</b> para começar</>)
                                    : 'Tente alterar o filtro ou criar um novo post'
                                  }
                                </small>
                              </div>
                            )}
                          </Col>
                        )}
                      </Row>
                    </div>
                  </Col>
                  <Col lg={8}>
                    <div style={{ 
                      border: '1px solid var(--blue1)', 
                      borderRadius: '8px', 
                      padding: '10px',
                      backgroundColor: '#fff'
                    }}>
                      {error && (
                        <Alert variant="danger" onClose={() => setError(null)} dismissible>
                          {error}
                        </Alert>
                      )}
                      {success && (
                        <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
                          {success}
                        </Alert>
                      )}

                      {(selectedPost || isCreatingNew) ? (
                        <Form>
                          <Row>
                            <Col lg={12} className="mb-3">
                              <div className="d-flex justify-content-between align-items-center mb-2" style={{
                                paddingBottom: '12px',
                              }}>
                                <h5 className="mb-0 d-flex align-items-center">
                                  {isCreatingNew ? (
                                    <>
                                      <LiaPlusSolid className="me-2" style={{ fontSize: '1rem' }} />
                                      Criar Post
                                    </>
                                  ) : (
                                    <>
                                      <LiaEditSolid size={24} className="me-2" style={{ marginTop: '-2px' }} />
                                      Editar Post
                                    </>
                                  )}
                                </h5>
                                <div className="d-flex align-items-center gap-2">
                                  <Button 
                                    variant="success" 
                                    onClick={handleSavePost}
                                    disabled={loading}
                                    className="d-flex align-items-center"
                                    style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                                  >
                                    <LiaSave className="me-1" size={18} />
                                    Salvar
                                  </Button>
                                  {!isCreatingNew && selectedPost && (
                                    <Button 
                                      variant="danger" 
                                      onClick={() => confirmDelete(selectedPost)}
                                      disabled={loading}
                                      className="d-flex align-items-center"
                                      style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                                    >
                                      <LiaTrashAlt className="me-2" size={18} />
                                      Excluir
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </Col>
                            
                            <Col lg={12} className="mb-3">
                              <Form.Group>
                                <Form.Label><b>Título</b></Form.Label>
                                <Form.Control
                                  type="text"
                                  value={title}
                                  onChange={(e) => setTitle(e.target.value)}
                                  placeholder="Digite o título do post"
                                  disabled={loading}
                                />
                              </Form.Group>
                            </Col>

                            <Col lg={6} className="mb-3">
                              <Form.Group>
                                <Form.Label>
                                  <b>Slug</b>
                                  <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                      <Tooltip>
                                        <strong>O que é slug?</strong><br />
                                        É a parte da URL que identifica o post de forma amigável.<br />
                                        <br />
                                        <strong>Geração automática:</strong><br />
                                        Será criado a partir do título convertendo para minúsculas,<br />
                                        removendo acentos e substituindo espaços por hífens.<br />
                                        <br />
                                        <strong>Exemplo:</strong> "Meu Primeiro Post!" → "meu-primeiro-post"<br />
                                        <br />
                                        Deixe em branco para geração automática.
                                      </Tooltip>
                                    }
                                  >
                                    <span style={{ marginLeft: '8px', cursor: 'pointer', color: 'var(--blue3)' }}>
                                      <FaInfoCircle size={14} />
                                    </span>
                                  </OverlayTrigger>
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  value={slug}
                                  onChange={(e) => setSlug(e.target.value)}
                                  placeholder="slug-do-post"
                                  disabled={loading}
                                />
                              </Form.Group>
                            </Col>

                            <Col lg={6} className="mb-3">
                              <Form.Group>
                                <Form.Label><b>Status</b></Form.Label>
                                <Form.Select
                                  value={status}
                                  onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                                  disabled={loading}
                                >
                                  <option value="draft">Rascunho</option>
                                  <option value="published">Publicado</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>

                            <Col lg={12} className="mb-3">
                              <Form.Group>
                                <Form.Label><b>Imagens</b></Form.Label>
                                <Row>
                                  <Col lg={2} className="mb-2">
                                    <div style={{
                                      border: '2px dashed #CCC',
                                      borderRadius: '8px',
                                      textAlign: 'center',
                                      backgroundColor: 'rgba(0, 123, 255, 0.02)',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                      aspectRatio: '1',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                      onClick={() => document.getElementById('imageInput')?.click()}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(0, 123, 255, 0.05)'
                                        e.currentTarget.style.borderColor = 'var(--blue3)'
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(0, 123, 255, 0.02)'
                                        e.currentTarget.style.borderColor = '#CCC'
                                      }}
                                    >
                                      <input
                                        id="imageInput"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleAddImages}
                                        style={{ display: 'none' }}
                                        disabled={loading}
                                      />
                                      <LiaPlusSolid size={32} style={{ color: 'var(--blue3)', marginBottom: '5px' }} />
                                      <div style={{ fontSize: '1em', color: '#666' }}>
                                        Clique para adicionar imagens
                                      </div>
                                    </div>
                                  </Col>
                                    {images.length > 0 && images.map((imageUrl, index) => (
                                      <Col lg={2} className="mb-3">
                                        <div
                                          key={index}
                                          style={{
                                            position: 'relative',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            border: '1px solid #CCC',
                                            aspectRatio: '1',
                                            backgroundColor: '#f5f5f5'
                                          }}
                                        >
                                          <img
                                            src={imageUrl}
                                            alt={`Preview ${index + 1}`}
                                            style={{
                                              width: '100%',
                                              height: '100%',
                                              objectFit: 'cover'
                                            }}
                                          />
                                          <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleRemoveImage(index)}
                                            disabled={loading}
                                            style={{
                                              position: 'absolute',
                                              top: '5px',
                                              right: '5px',
                                              padding: '4px 8px',
                                              fontSize: '0.75em',
                                              borderRadius: '4px'
                                            }}
                                          >
                                            <FaTrash size={10} />
                                          </Button>
                                        </div>
                                      </Col>
                                    ))}
                                </Row>
                              </Form.Group>
                            </Col>

                            <Col lg={12} className="mb-3">
                              <Form.Group>
                                <Form.Label><b>Texto</b></Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={15}
                                  value={text}
                                  onChange={(e) => setText(e.target.value)}
                                  placeholder="Digite o conteúdo do post..."
                                  disabled={loading}
                                  style={{ resize: 'vertical' }}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Form>
                      ) : (
                        <div className="text-center text-muted py-5" style={{
                          border: '2px dashed var(--blue1)',
                          borderRadius: '12px',
                          padding: '60px 20px',
                          backgroundColor: 'rgba(0, 123, 255, 0.02)'
                        }}>
                          <LiaBookSolid size={80} opacity={0.15} className="mb-3" />
                          <h6 style={{ color: '#666', fontWeight: '500' }}>
                            Nenhum post selecionado
                          </h6>
                          <p className="mt-2" style={{ fontSize: '0.9em', color: '#999' }}>
                            Selecione um post da lista ao lado para editar<br />ou crie um novo post
                          </p>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </Col>
              )}
            </Row>
          </div>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja deletar o post <b>{postToDelete?.title}</b>?
          <br />
          Esta ação não pode ser desfeita.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeletePost} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Deletar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Main>
  )
}
