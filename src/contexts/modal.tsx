import React, { cloneElement, useCallback, useContext, useState } from 'react'
import ReactModal from 'react-modal'
import { useResponsive } from '@/contexts/theme/hooks'
import styled, { createGlobalStyle, keyframes } from 'styled-components'
import { sleep } from '@/utils'

export type ModalContextValue = {
  open: (content: ModalConfig['content'], closeable?: boolean) => void
  configModal: (config: ModalConfig) => void
  update: (modalContent?: JSX.Element) => void
  close: () => void
  addEventListener: (event: ModalEvents, callback: () => void) => number
  removeEventListener: (event: ModalEvents, callbackId: number) => void
}

export type ModalConfig = {
  content?: JSX.Element | string
  closeable?: boolean
  contentStyle?: React.CSSProperties
  contentWrapper?: JSX.Element
}

export type ModalEvents = 'open' | 'close' | 'update'

const ModalGlobalStyle = createGlobalStyle`
  .ReactModal__Overlay {
    opacity: 0;
    transition: opacity 0.18s ease-in-out;

    background-color: rgba(3, 2, 29, 0.7) !important;
    z-index: 11;
    display: flex;
    align-items: center;
    justify-content: center;
    // backdropFilter: 'blur(1px)',
  }

  .ReactModal__Overlay--after-open{
    opacity: 1;
  }

  .ReactModal__Overlay--before-close{
    opacity: 0;
  }
`

const responsiveDefaultContentStyle = (isDesktop: boolean) => {
  if (isDesktop) {
    return {
      width: '90%',
      margin: '0 auto',
      background: 'none',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontFamily: 'gilroy'
    }
  }

  return {
    width: '90%',
    margin: '0',
    background: 'none',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontFamily: 'gilroy'
  }
}

const ModalContext = React.createContext<ModalContextValue>({
  open: (_: ModalConfig['content']) => {},
  configModal: (_: ModalConfig) => {},
  close: () => {},
  update: () => {},
  addEventListener: (_event: ModalEvents, _callback: () => void) => 0,
  removeEventListener: (_event: ModalEvents, _callbackId: number) => {}
})

const ZoomIn = keyframes`
  from {
    transform: scale(0%);
  }
  
  to {
    transform: scale(100%);
  }
`

const ZoomOut = keyframes`
  from {
    transform: scale(100%);
  }
  
  to {
    transform: scale(0%);
  }
`

const ZoomContainer = styled.div`
  &.in {
    animation: ${ZoomIn} 0.2s ease-out;
  }
  
  &.out {
    animation: ${ZoomOut} 0.2s ease-out;
  }
`

const StyledReactModal = styled(ReactModal)`
  :focus-visible {
    outline: none;
  }
`

const ModalWrapper: React.FC<{ contentStyle?: React.CSSProperties; isOpen: boolean; contentWrapper?: JSX.Element }> = ({
  contentStyle,
  contentWrapper,
  isOpen,
  children
}) => {
  const { isDesktop } = useResponsive()

  return (
    <StyledReactModal
      preventScroll={true}
      isOpen={isOpen}
      className={'modal-wrapper'}
      appElement={document.getElementById('root')!}
      closeTimeoutMS={200}
      style={{
        content: { ...responsiveDefaultContentStyle(isDesktop), ...contentStyle }
      }}
    >
      {contentWrapper ? cloneElement(contentWrapper, { children }) : children}
    </StyledReactModal>
  )
}

const ModalProvider: React.FC = ({ children }) => {
  const [onClosing, setOnClosing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<JSX.Element | string>()

  const [callbackByEvent, setCallbackByEvent] = useState<Map<ModalEvents, { id: number; callback: () => void }[]>>(
    new Map()
  )

  const [config, setConfig] = useState<ModalConfig>({
    closeable: true
  })

  const close = useCallback(async () => {
    setOnClosing(true)
    await sleep(100)
    setContent(undefined)
    setIsOpen(false)

    const callbacks = callbackByEvent.get('close')

    callbacks?.forEach(({ callback }) => {
      callback()
    })
  }, [callbackByEvent])

  const open = useCallback(async (content: ModalConfig['content'], closeable?: boolean) => {
    if (!isOpen) {
      await close()
    }

    setIsOpen(true)
    setOnClosing(false)

    if (closeable === undefined) {
      setConfig(prev => ({ ...prev, closeable: true }))
    } else {
      setConfig(prev => ({ ...prev, closeable }))
    }

    content && setContent(content)

    const callbacks = callbackByEvent.get('open')

    callbacks?.forEach(({ callback }) => {
      callback()
    })
  }, [callbackByEvent, close])

  const update = useCallback(async (modalContent?: JSX.Element) => {
    setOnClosing(true)
    await sleep(100)
    setContent(modalContent)
    setOnClosing(false)

    const callbacks = callbackByEvent.get('update')
    callbacks?.forEach(({ callback }) => {
      callback()
    })
  }, [callbackByEvent])

  const configModal = (config: ModalConfig) => {
    setConfig(prev => ({
      ...prev,
      ...config
    }))
  }

  const addEventListener = useCallback(
    (event: ModalEvents, callback: () => void) => {
      const random = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
      const entry: { id: number; callback: () => void } = { id: -1, callback }

      const exist = (idToCheck: number) => {
        return callbackByEvent.get(event)?.some(({ id }) => id === idToCheck)
      }

      do {
        entry.id = random()
      } while (exist(entry.id))

      setCallbackByEvent(prev => {
        const arr = prev.get(event) || []

        return prev?.set(event, [...arr, entry])
      })

      return entry.id
    },
    [callbackByEvent]
  )

  const removeEventListener = useCallback((event: ModalEvents, callbackId: number) => {
    setCallbackByEvent(prev => {
      const callbacks = prev.get(event)

      const index = () => {
        if (!callbacks) return -1

        for (let i = 0; i < callbacks.length || 0; i++) {
          const cb = callbacks[i]
          if (cb.id === callbackId) {
            return i
          }
        }

        return -1
      }

      callbacks?.splice(index(), 1)

      return prev?.set(event, callbacks || [])
    })

    return
  }, [callbackByEvent])

  return (
    <ModalContext.Provider value={{ open, update, close, configModal, addEventListener, removeEventListener }}>
      <ModalGlobalStyle />
      <ModalWrapper isOpen={isOpen} contentStyle={config.contentStyle} contentWrapper={config.contentWrapper}>
        <ZoomContainer className={onClosing ? 'out' : 'in'}>
          {content}
        </ZoomContainer>
      </ModalWrapper>
      {children}
    </ModalContext.Provider>
  )
}

const useModal = () => {
  const { open, update, close, configModal, addEventListener, removeEventListener } = useContext(ModalContext)

  return {
    openModal: open,
    updateModal: update,
    closeModal: close,
    configModal,
    addEventListener,
    removeEventListener
  }
}

export { ModalContext, ModalWrapper, ModalProvider, useModal }
