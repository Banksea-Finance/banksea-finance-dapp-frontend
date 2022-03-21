import React from 'react'
import Notification from 'rc-notification'
import { NotificationInstance } from 'rc-notification/es/Notification'
import { NoticeTitle, NotifyTypeIcon } from './Notification.style'
import Flex from '@react-css/flex'

let notification: NotificationInstance

export type NotifyTypes = 'info' | 'warning' | 'error' | 'success'

export type NotifyProps = {
  title: string
  message: JSX.Element | string
  type?: NotifyTypes
  duration?: number
}

function notify({ title = '', message = '', type = 'info', duration = 3 }: NotifyProps) {
  if (!notification) {
    Notification.newInstance(
      {
        maxCount: 5,
        getContainer: () => document.getElementById('root')!,
      },
      instance => {
        notification = instance
      }
    )
  }

  notification.notice({
    content: (
      <Flex alignItems={'center'}>
        <NotifyTypeIcon className={type} />
        <div>
          <NoticeTitle>{title}</NoticeTitle>
          <div style={{ color: 'white', opacity: 0.5 }}>{message}</div>
        </div>
      </Flex>
    ),
    style: {
      left: '2%',
      bottom: '2%',
      position: 'fixed',
      minWidth: 300,
      zIndex: 19
    },
    closable: true,
    duration
  })
}

export default notify
