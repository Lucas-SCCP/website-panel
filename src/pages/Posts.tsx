import { useEffect, useState } from 'react'
import { Row, Col, Button, Form, Modal, Spinner, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Main } from './Main'
import { LiaBookSolid, LiaEditSolid, LiaPlusSolid, LiaSave, LiaTrashAlt } from 'react-icons/lia'
import { FaTrash, FaInfoCircle } from 'react-icons/fa'
import { UseWebsiteStore } from '../stores/UseWebsiteStore'
import { UseUserStore } from '../stores/UseUserStore'
import { ApiService } from '../services/ApiService'
import type { PostType } from '../types/PostsType'

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
  
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [slug, setSlug] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [images, setImages] = useState<Array<{ name: string; cover?: boolean }>>([])
  const [mainImageIndex, setMainImageIndex] = useState<number>(0)
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')

  const getImageUrl = (imageUrl: string): string => {
    console.log('imageUrl input:', imageUrl)
    console.log('getImageUrl', imageUrl)
    // Se for uma URL blob (imagem local temporária), retorna diretamente
    if (imageUrl.startsWith('blob:')) {
      return imageUrl
    }
    
    // Se já for uma URL completa (http/https), retorna diretamente
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }
    
    // Constrói a URL do S3
    const s3BucketUrl = import.meta.env.VITE_S3_IMAGES_BUCKET_URL
    console.log('S3 Bucket URL:', s3BucketUrl)
    if (!s3BucketUrl) {
      console.error('VITE_S3_IMAGES_BUCKET_URL não está definida')
      return imageUrl // Retorna a URL relativa como fallback
    }

    const websiteDomain = import.meta.env.VITE_WEBSITE_DOMAIN
    const domainFormatted = websiteDomain
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\./g, '')
      .replace(/-/g, '')
    
    return `${s3BucketUrl}/${domainFormatted}/${imageUrl}`
  }

  const parseImages = (images: string[] | Record<string, unknown> | string | null | undefined): Array<{ name: string; cover?: boolean }> => {
    if (!images) return []

    // Se já for um array, normalize cada item
    if (Array.isArray(images)) {
      return images.map(item => {
        if (typeof item === 'string') return { name: item }
        if (
          typeof item === 'object' &&
          item !== null &&
          'name' in item
        ) {
          return { name: String((item as { name?: string }).name ?? ''), cover: !!(item as { cover?: boolean }).cover }
        }
        return { name: String(item) }
      })
    }

    // Se for string, tenta parsear como JSON
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images)
        return parseImages(parsed as string[] | Record<string, unknown> | string | null | undefined)
      } catch {
        // string simples (nome da imagem)
        return [{ name: images }]
      }
    }

    // Se for objeto (map), converte valores para array
    if (typeof images === 'object') {
      const vals = Object.values(images as Record<string, { name?: string; cover?: boolean }>)
      return vals.map(v => {
        if (typeof v === 'string') return { name: v }
        if (typeof v === 'object' && v !== null) return { name: String(v.name ?? ''), cover: !!v.cover }
        return { name: String(v) }
      })
    }

    return []
  }

  const loadPosts = async () => {
    if (!selectedWebsite) {
      console.log('No website selected')
      setPosts([])
      return
    }

    setLoading(true)
    setError(null)
    try {
      const apiService = new ApiService()
      const postsData = await apiService.getPostsByWebsiteId(selectedWebsite.id)
      setPosts(postsData || [])
      return postsData || []
    } catch (err) {
      console.error('Erro ao carregar posts:', err)
      setError('Erro ao carregar posts')
      setPosts([])
      return []
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
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
    
    // Filtra imagens inexistentes (removidas do S3)
    const parsedImages = parseImages(post.images)
    // Opcional: checar existência da imagem no S3 via HEAD request, mas aqui só filtra nomes vazios ou nulos
    const filteredImages = parsedImages.filter(img => !!img.name)
    const defaultIndex = post.main_image_index ?? 0
    const hasCover = filteredImages.some(img => !!img.cover)
    const normalized = filteredImages.map((img, idx) => ({ ...img, cover: hasCover ? !!img.cover : idx === defaultIndex }))
    setImages(normalized)
    // alinhar mainImageIndex com a imagem marcada como cover, se existir
    const coverIndex = normalized.findIndex(img => !!img.cover)
    setMainImageIndex(coverIndex >= 0 ? coverIndex : defaultIndex)
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
    setMainImageIndex(0)
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

      const now = new Date()
      const pad = (n: number, len = 3) => n.toString().padStart(len, '0')
      let imageIndex = 1
      const imagesToUpload: Array<{ file: File; newName: string; cover?: boolean; index?: number }> = []
      const imagesArray: { [key: string]: { name: string; cover: boolean } } = {}

      for (let i = 0; i < images.length; i++) {
        const img = images[i]
        const isBlob = typeof img.name === 'string' && img.name.startsWith('blob:')
        let newName = img.name
        const isCover = i === mainImageIndex
            if (isBlob) {
          const fileInput = document.getElementById('imageInput') as HTMLInputElement | null
          if (fileInput && fileInput.files) {
            for (let f = 0; f < fileInput.files.length; f++) {
              const file = fileInput.files[f]
              if (!imagesToUpload.some(u => u.file === file)) {
                let ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
                if (ext === 'jpeg') ext = 'jpg'
                newName = `${now.getFullYear()}${pad(now.getMonth()+1,2)}${pad(now.getDate(),2)}_${pad(now.getHours(),2)}${pad(now.getMinutes(),2)}${pad(now.getSeconds(),2)}${pad(now.getMilliseconds(),3)}_${pad(imageIndex,3)}.${ext}`
                    imagesToUpload.push({ file, newName, cover: isCover, index: i })
                imageIndex++
                break
              }
            }
          }
        }
        imagesArray[i] = { name: newName, cover: isCover }
      }

      // 2. Enviar imagens para API de upload
      console.log('TESTE1', imagesToUpload)
      if (imagesToUpload.length > 0) {
        const formData = new FormData()
        imagesToUpload.forEach(obj => {
          formData.append('files', obj.file, obj.newName)
        })
        formData.append('folder', 'noisdevbr')
        // Ajuste a URL abaixo para o endpoint correto de upload
        const uploadUrl = import.meta.env.VITE_SERVICE_FILEUPLOADER + '/upload/images'
        const uploadResp = await fetch(uploadUrl, {
          method: 'POST',
          body: formData
        })
        if (!uploadResp.ok) {
          throw new Error('Erro ao fazer upload das imagens')
        }

        // tenta obter os nomes reais retornados pelo servidor para manter consistência
        let uploadedFiles: string[] = []
        try {
          const json = await uploadResp.json()
          if (Array.isArray(json)) uploadedFiles = json
          else if (Array.isArray(json.files)) uploadedFiles = json.files
          else if (Array.isArray(json.data?.files)) uploadedFiles = json.data.files
          else if (Array.isArray(json.savedFiles)) uploadedFiles = json.savedFiles
        } catch {
          // fallback: usa os newName que enviamos
          uploadedFiles = imagesToUpload.map(u => u.newName)
        }

        // mapa do índice original da imagem -> nome final no servidor
        const indexToStoredName = new Map<number, string>()
        for (let j = 0; j < imagesToUpload.length; j++) {
          const itm = imagesToUpload[j]
          const stored = uploadedFiles[j] || itm.newName
          if (typeof itm.index === 'number') indexToStoredName.set(itm.index, stored)
        }

        // Atualiza imagesArray com os nomes reais
        Object.keys(imagesArray).forEach(k => {
          const idx = Number(k)
          if (indexToStoredName.has(idx)) {
            imagesArray[k] = { ...imagesArray[k], name: indexToStoredName.get(idx)! }
          }
        })

        // Atualiza o estado images substituindo blobs pelos nomes retornados
        setImages(prevImages => prevImages.map((img, i) => {
          if (indexToStoredName.has(i)) {
            return { ...img, name: indexToStoredName.get(i)!, cover: !!img.cover }
          }
          return img
        }))

        // Limpa temporários
        imagesToUpload.length = 0
      }

      // 3. Enviar post para API Service
      if (isCreatingNew) {
        const postData: any = {
          website_id: selectedWebsite.id,
          title: title.trim(),
          text: text.trim(),
          slug: slug.trim() || undefined,
          images: imagesArray,
          main_image_index: images.length > 0 ? mainImageIndex : undefined,
          status
        }
        await apiService.createPost(postData, token)
        setSuccess('Post criado com sucesso!')
        setIsCreatingNew(false)
      } else if (selectedPost) {
        const updates: any = {
          title: title.trim(),
          text: text.trim(),
          slug: slug.trim() || undefined,
          images: imagesArray,
          main_image_index: images.length > 0 ? mainImageIndex : undefined,
          status
        }
        await apiService.updatePost(selectedPost.id, updates, token)
        setSuccess('Post atualizado com sucesso!')
      }

      // Atualiza o estado local de imagens para refletir os nomes finais gerados
      try {
        const imagesFinal = Object.values(imagesArray).map((v: any) => ({ name: String(v.name), cover: !!v.cover }))
        if (imagesFinal.length > 0) {
          setImages(imagesFinal)
          setMainImageIndex(Math.min(mainImageIndex, imagesFinal.length - 1))
        }
      } catch {
        // ignore
      }

      // Reload posts and, se possível, seleciona o post atualizado para sincronizar o estado
      const reloaded = await loadPosts()
      if (!isCreatingNew && selectedPost) {
        const updated = Array.isArray(reloaded) ? reloaded.find(p => p.id === selectedPost.id) : undefined
        if (updated) {
          handleSelectPost(updated)
        }
      } else if (isCreatingNew) {
        // tenta selecionar o post recém-criado (se encontrado por título/slug mais recente)
        if (Array.isArray(reloaded) && reloaded.length > 0) {
          const found = reloaded.find(p => p.title === title && p.websiteId === selectedWebsite?.id) || reloaded[0]
          if (found) handleSelectPost(found)
        }
      }
      // Não limpar o formulário nem sair do modo de edição após salvar
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
        setMainImageIndex(0)
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

    const newImageObjects: Array<{ name: string; cover?: boolean }> = []
    Array.from(files).forEach(file => {
      // Cria URL temporária para preview
      const imageUrl = URL.createObjectURL(file)
      newImageObjects.push({ name: imageUrl })
    })

    setImages([...images, ...newImageObjects])
  }

  const handleRemoveImage = (index: number) => {
    const imageToRemove = images[index]
    const isBlob = imageToRemove && typeof imageToRemove.name === 'string' && imageToRemove.name.startsWith('blob:')
    const newImages = images.filter((_, i) => i !== index)

    // Sempre libera memória se for blob
    if (imageToRemove && typeof imageToRemove.name === 'string' && imageToRemove.name.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.name)
    }

    const updateImagesState = (updatedImagesDb?: Array<{ name: string; cover?: boolean }>) => {
      setImages(newImages)
      // Atualiza selectedPost.images localmente para refletir o banco
      if (selectedPost && updatedImagesDb) {
        setSelectedPost({ ...selectedPost, images: updatedImagesDb })
        // Atualiza também o array de posts para refletir na listagem
        setPosts(prevPosts => prevPosts.map(p =>
          p.id === selectedPost.id ? { ...p, images: updatedImagesDb } : p
        ))
      }
      // Ajusta o índice da imagem principal se necessário
      if (mainImageIndex === index) {
        setMainImageIndex(0)
      } else if (mainImageIndex > index) {
        setMainImageIndex(mainImageIndex - 1)
      }
    }

    if (isBlob) {
      updateImagesState()
      return
    }

    // Se não for blob, remover do S3 e atualizar banco
    (async () => {
      try {
        setLoading(true)
        setError(null)
        const apiService = new ApiService()
        // Chama API de remoção do arquivo
        const removeUrl = import.meta.env.VITE_SERVICE_FILEUPLOADER + '/upload/file'
        const resp = await fetch(removeUrl, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: imageToRemove.name, folder: 'noisdevbr' })
        })
        if (!resp.ok) throw new Error('Erro ao remover imagem do servidor')

        // Atualiza banco de dados (remove do array e faz update)
        if (selectedPost && token) {
          // Busca o array real do banco (pode ser string ou array de objetos)
          let dbImages: Array<{ name: string; cover?: boolean }> = []
          if (Array.isArray(selectedPost.images)) {
            dbImages = selectedPost.images as Array<{ name: string; cover?: boolean }>
          } else if (typeof selectedPost.images === 'string') {
            try {
              dbImages = JSON.parse(selectedPost.images)
            } catch {
              dbImages = []
            }
          }
          // Remove pelo nome
          const updatedImages = dbImages.filter(img => img.name !== imageToRemove.name)
          // Ajusta main_image_index
          let newMainIndex = mainImageIndex
          if (mainImageIndex === index) newMainIndex = 0
          else if (mainImageIndex > index) newMainIndex = mainImageIndex - 1
          const updates = {
            images: updatedImages,
            main_image_index: updatedImages.length > 0 ? newMainIndex : undefined
          }
          await apiService.updatePost(selectedPost.id, updates, token)
          // Atualiza selectedPost.images localmente para refletir o banco
          updateImagesState(updatedImages)
          return
        }
        updateImagesState()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao remover imagem')
      } finally {
        setLoading(false)
      }
    })()
  }

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
                  <Col lg={4} className='pe-md-0 mb-md-0 mb-2'>
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
                            className='tiktok-sans fw-100'
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
                                  <div className='mb-2' style={{ fontWeight: 'bold' }}>
                                    {post.title}
                                  </div>
                                  
                                  <div style={{ 
                                    display: 'flex', 
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                  }}>
                                    <div>
                                      <span style={{ 
                                        fontSize: '0.7em', 
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        color: '#000',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        backgroundColor: '#CCC'
                                      }}>
                                      {(() => {
                                        try {
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
                                      </span>
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
                                        {post.status === 'published' ? 
                                          <>
                                            Publicado
                                          </> : 
                                          <>
                                            Rascunho
                                          </>
                                        }
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

                            <Col lg={4} className="mb-3">
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

                            <Col lg={8} className="mb-3">
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

                            <Col lg={12} className="mb-3">
                              <Form.Group>
                                <Form.Label>
                                  <b>Imagens</b>
                                  <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                      <Tooltip>
                                        <strong>Imagem em Destaque</strong><br />
                                        Clique em uma imagem para defini-la como 'Destaque'.<br />
                                        A imagem em 'Destaque' será exibida nas listagens de posts.
                                      </Tooltip>
                                    }
                                  >
                                    <span style={{ marginLeft: '8px', cursor: 'pointer', color: 'var(--blue3)' }}>
                                      <FaInfoCircle size={14} />
                                    </span>
                                  </OverlayTrigger>
                                </Form.Label>
                                <Row>
                                  <Col lg={2} sm={6} xs={6} className="mb-2">
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
                                        Adicionar imagens
                                      </div>
                                    </div>
                                  </Col>
                                    {Array.isArray(images) && images.length > 0 && images.map((image, index) => (
                                      <Col lg={2} sm={6} xs={6} className="mb-3" key={index}>
                                        <div
                                          style={{
                                            position: 'relative',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            border: mainImageIndex === index ? '3px solid var(--blue3)' : '1px solid #CCC',
                                            aspectRatio: '1',
                                            backgroundColor: '#f5f5f5',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            boxShadow: mainImageIndex === index ? '0 0 15px rgba(0, 123, 255, 0.3)' : 'none'
                                          }}
                                          onClick={() => {
                                            setMainImageIndex(index)
                                            setImages(images.map((img, i) => ({ ...img, cover: i === index })))
                                          }}
                                          onMouseEnter={(e) => {
                                            if (image.cover && mainImageIndex !== index) {
                                              e.currentTarget.style.borderColor = 'var(--blue3)'
                                              e.currentTarget.style.opacity = '0.8'
                                            }
                                          }}
                                          onMouseLeave={(e) => {
                                            if (image.cover && mainImageIndex !== index) {
                                              e.currentTarget.style.borderColor = '#CCC'
                                              e.currentTarget.style.opacity = '1'
                                            }
                                          }}
                                        >
                                          <img
                                            src={getImageUrl(image.name)}
                                            alt={`Preview ${index + 1}`}
                                            style={{
                                              width: '100%',
                                              height: '100%',
                                              objectFit: 'cover'
                                            }}
                                          />
                                          {image.cover && mainImageIndex === index && (
                                            <div
                                              style={{
                                                position: 'absolute',
                                                top: '0',
                                                left: '0',
                                                right: '0',
                                                padding: '4px 8px',
                                                backgroundColor: 'var(--blue3)',
                                                color: 'white',
                                                fontSize: '0.7em',
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                              }}
                                            >
                                              DESTAQUE
                                            </div>
                                          )}
                                          <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              handleRemoveImage(index)
                                            }}
                                            disabled={loading}
                                            style={{
                                              position: 'absolute',
                                              bottom: '5px',
                                              right: '5px',
                                              padding: '4px 8px',
                                              fontSize: '0.75em',
                                              borderRadius: '4px',
                                              zIndex: 10
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
                          borderRadius: '12px',
                          padding: '60px 20px',
                        }}>
                          <LiaBookSolid size={80} opacity={0.15} />
                          <p className='tiktok-sans fw-100' style={{ fontSize: '0.9em', color: '#999' }}>
                            CRIE UM NOVO POST OU<br />SELECIONE UM PARA EDITAR
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
