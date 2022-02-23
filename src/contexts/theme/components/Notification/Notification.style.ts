import styled, { css } from 'styled-components'

const FadeEffect = () => css`
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-timing-function: cubic-bezier(0.55, 0, 0.55, 0.2);
`

export const NotificationStyleMixin = css`
  .rc-notification {
    z-index: 1000;
    width: fit-content;
    height: 200px;

    &-notice {
      padding: 16px 32px 16px 16px;
      border-radius: 16px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      border: 0 solid rgba(0, 0, 0, 0);
      background: rgb(7, 32, 54);
      display: block;
      width: auto;
      line-height: 1.5;
      position: relative;
      margin: 10px 0;

      &-closable {
        padding-right: 20px;
      }

      &-close {
        position: absolute;
        right: 16px;
        top: 16px;
        color: white;
        cursor: pointer;
        outline: none;
        font-size: 16px;
        font-weight: 700;
        line-height: 1;
        text-shadow: 0 1px 0 #fff;
        opacity: 0.6;
        text-decoration: none;

        &-x:after {
          content: '×';
        }

        &:hover {
          opacity: 1;
          text-decoration: none;
        }
      }
    }

    &-fade-appear,
    &-fade-enter {
      opacity: 0;
      animation-play-state: paused;
      ${FadeEffect()}
    }

    &-fade-leave {
      ${FadeEffect()}
      animation-play-state: paused;
    }

    &-fade-appear&-fade-appear-active,
    &-fade-enter&-fade-enter-active {
      animation-name: rcNotificationFadeIn;
      animation-play-state: running;
    }

    &-fade-leave&-fade-leave-active {
      animation-name: rcDialogFadeOut;
      animation-play-state: running;
    }

    @keyframes rcNotificationFadeIn {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    @keyframes rcDialogFadeOut {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  }
`

export const NoticeTitle = styled.div`
  font-family: 'gilroy';
  color: white;
  font-weight: 600;
  margin-bottom: 10px;
`

export const NotifyTypeIcon = styled.div`
  font-size: 24px;
  margin-right: 10px;

  &.info:after {
    content: 'ℹ️';
  }

  &.error:after {
    content: '❌';
  }

  &.warning:after {
    content: '⚠️';
  }

  &.success:after {
    content: '✅';
  }
`
