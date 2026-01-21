// src/theme.js
import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  // 1. Estilos Globais (Fundo da página, fonte, etc)
  styles: {
    global: {
      'html, body': {
        bg: 'gray.900', // Aquele fundo escuro padrão
        color: 'white',
        lineHeight: 'tall',
      },
    },
  },

  // 2. Layer Styles (Nossos "CSS Classes" reutilizáveis)
  layerStyles: {
    // O estilo do Card "Vidro"
    glassCard: {
      bg: 'rgba(26, 32, 44, 0.7)', // Cinza escuro translúcido
      backdropFilter: 'blur(10px)', // O desfoque
      borderWidth: '1px',
      borderColor: 'gray.700',
      borderRadius: 'xl',
      boxShadow: 'xl',
      p: 6, // Padding padrão de 24px
    },
    // O estilo de container tracejado (quando desconectado)
    dashedBox: {
      p: 6,
      textAlign: 'center',
      color: 'gray.500',
      borderWidth: '1px',
      borderColor: 'gray.700',
      borderRadius: 'lg',
      borderStyle: 'dashed',
    },
  },
  
  // 3. Text Styles (Para títulos e textos comuns)
  textStyles: {
    gradientTitle: {
      bgGradient: 'linear(to-r, cyan.400, purple.500)',
      bgClip: 'text',
      fontWeight: 'extrabold',
    }
  },
  inputBase: {
      bg: 'gray.700',
      border: 'none',
      color: 'white',
      _placeholder: { color: 'gray.500' },
      _focus: { 
        boxShadow: '0 0 0 2px var(--chakra-colors-purple-500)'
    },
  },
})

export default theme