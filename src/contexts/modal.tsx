import React, { cloneElement, useContext, useState } from 'react'
import ReactModal from 'react-modal'
import { useResponsive } from '@/contexts/theme/hooks'

export type ModalContextValue = {
  open: (content: ModalConfig['content'], closeable?: boolean) => void
  configModal: (config: ModalConfig) => void
  update: (modalContent?: JSX.Element) => void
  close: () => void
}

export type ModalConfig = {
  content?: JSX.Element | string
  closeable?: boolean
  contentStyle?: React.CSSProperties
  contentWrapper?: JSX.Element
}

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
    margin: '10vh 0 0 0',
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
  update: () => {}
})

const ModalWrapper: React.FC<{ contentStyle?: React.CSSProperties; isOpen: boolean, contentWrapper?: JSX.Element }> = ({
  contentStyle,
  contentWrapper,
  isOpen,
  children
}) => {
  const { isDesktop } = useResponsive()

  return (
    <ReactModal
      preventScroll={true}
      isOpen={isOpen}
      className={'modal-wrapper'}
      style={{
        overlay: {
          background: 'rgba(29, 20, 56, 0.09)',
          backdropFilter: 'blur(10px)',
          zIndex: 11,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        },
        content: { ...responsiveDefaultContentStyle(isDesktop), ...contentStyle }
      }}
    >
      {contentWrapper ? cloneElement(contentWrapper, { children }) : children}
    </ReactModal>
  )
}

const CloseButton: React.FC<{ show?: boolean; onClose: () => void }> = ({ show, onClose }) => {
  const { isDesktop } = useResponsive()

  if (!show) {
    return <></>
  }

  return (
    <img
      alt={'close'}
      onClick={onClose}
      src={require('@/assets/images/close.png')}
      style={{ position: 'absolute', right: '20px', top: isDesktop ? '20px' : '70px', cursor: 'pointer' }}
    />
  )
}

const ModalProvider: React.FC = ({ children }) => {
  const [visible, setVisible] = useState(false)
  const [content, setContent] = useState<JSX.Element | string>()

  const [config, setConfig] = useState<ModalConfig>({
    closeable: true
  })

  const open = (content: ModalConfig['content'], closeable?: boolean) => {
    setVisible(true)

    if (closeable === undefined) {
      setConfig(prev => ({ ...prev, closeable: true }))
    } else {
      setConfig(prev => ({ ...prev, closeable }))
    }

    content && setContent(content)
  }

  const update = (modalContent?: JSX.Element) => {
    setContent(modalContent)
  }

  const close = () => setVisible(false)

  const configModal = (config: ModalConfig) => {
    setConfig(prev => ({
      ...prev,
      ...config
    }))
  }

  return (
    <ModalContext.Provider value={{ open, update, close, configModal }}>
      <ModalWrapper isOpen={visible} contentStyle={config.contentStyle} contentWrapper={config.contentWrapper}>
        <CloseButton show={config.closeable} onClose={close} />
        {content}
      </ModalWrapper>
      {children}
    </ModalContext.Provider>
  )
}

const useModal = () => {
  const { open, update, close, configModal } = useContext(ModalContext)

  return {
    openModal: open,
    updateModal: update,
    closeModal: close,
    configModal
  }
}

export { ModalContext, ModalWrapper, ModalProvider, useModal }
