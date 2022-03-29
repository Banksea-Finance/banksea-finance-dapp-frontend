import { StyledTabs } from './styles'
import React, { cloneElement, ReactElement } from 'react'
import { ButtonMenu } from '@/contexts/theme/components'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { WidthProps } from 'styled-system'
import { ButtonMenuProps } from '@/contexts/theme/components/ButtonMenu'

export interface TabsProps extends WidthProps, ButtonMenuProps {
  activeKey: string
  onTabChange: (key: string) => void
}

export type TabPaneProps = {
  title: string
  tabKey: string
}

const TabPane: React.FC<TabPaneProps> = ({ children }) => {
  return <div>{children}</div>
}

class Tabs extends React.Component<TabsProps, any> {
  static Pane = TabPane

  constructor(props: TabsProps | Readonly<TabsProps>) {
    super(props)

  }

  render() {
    const { children, activeKey, onTabChange, scale, variant, ...rest } = this.props

    return (
      <StyledTabs {...rest} className={'styled-tabs'}>
        <ButtonMenu
          style={{ width: 'fit-content', marginBottom: '16px' }}
          activeKey={activeKey}
          onItemClick={({ key }) => {
            onTabChange(key!)
          }}
          scale={scale}
          variant={variant}
        >
          {React.Children.map(children, (o: any, _i) =>
            cloneElement(<ButtonMenu.Item>{o.props.title}</ButtonMenu.Item>, {
              itemKey: o.props.tabKey
            })
          )}
        </ButtonMenu>

        <div style={{ width: '100%' }}>
          <SwitchTransition>
            <CSSTransition
              in
              mountOnEnter
              key={activeKey}
              addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
              classNames="tabs-fade"
              style={{ width: '100%' }}
            >
              {
                React.Children.toArray(children).find(
                  (child: any, _index) => (child as ReactElement).props.tabKey === activeKey
                )
              }
            </CSSTransition>
          </SwitchTransition>
        </div>
      </StyledTabs>
    )
  }
}

export default Tabs
