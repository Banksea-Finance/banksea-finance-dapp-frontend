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

async function notify({ title = '', message = '', type = 'info', duration = 3 }: NotifyProps) {
  if (!notification) {
    await new Promise<void>(resolve => {
      Notification.newInstance(
        {
          maxCount: 5,
          getContainer: () => document.getElementById('app')!,
          style: {
            position: 'fixed',
            right: '2%',
            top: '100px',
            zIndex: 19,
            minWidth: 300,

          }
        },
        instance => {
          notification = instance
          resolve()
        }
      )
    })
  }

  const key = `Notification-${Date.now()}`

  notification.notice({
    key,
    content: (
      <Flex alignItems={'center'}>
        <NotifyTypeIcon className={type} />
        <div>
          <NoticeTitle>{title}</NoticeTitle>
          <div style={{ color: '#FFFFFF7F' }}>{message}</div>
        </div>
      </Flex>
    ),
    style: {
      minWidth: 300,
    },
    closable: true,
    duration
  })

  return key
}

export default notify
