import React, { useEffect } from 'react'
import { CssVarsProvider } from '@mui/joy/styles'
import { Container, Sheet, Typography } from '@mui/joy'
import { createRoot } from 'react-dom/client'

function App() {
  useEffect(() => {
    const el = document.getElementById('loading-placeholder')
    if (el) {
      el.remove()
    }
  }, [])

  return (
    <CssVarsProvider defaultMode="dark">
      <Sheet
        variant="soft"
        color="primary"
        sx={{ py: 1, px: 1, gap: 2, display: 'flex', justifyContent: 'center' }}
      >
        <Typography variant="h1">Title</Typography>
      </Sheet>
      <Container
        sx={{
          mt: 2,
        }}
      >
        <Typography variant="body1">I am content</Typography>
      </Container>
    </CssVarsProvider>
  )
}

const domNode = document.getElementById('root')
const root = createRoot(domNode)
root.render(<App />)
