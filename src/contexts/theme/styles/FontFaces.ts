import { css } from 'styled-components'

const FontFaces = css`
  @font-face {
    font-family: 'gilroy';
    src: local('gilroy'), url(${require('@/assets/fonts/gilroy/Gilroy-Light.otf')}) format('opentype');
  }

  /** orbitron */
  @font-face {
    font-family: 'orbitron';
    font-weight: 400;
    src: local('orbitron'), url(${require('@/assets/fonts/orbitron/Orbitron-Regular.ttf')}) format('truetype');
  }

  @font-face {
    font-family: 'orbitron';
    font-weight: 500;
    src: local('orbitron'), url(${require('@/assets/fonts/orbitron/Orbitron-Medium.ttf')}) format('truetype');
  }

  @font-face {
    font-family: 'orbitron';
    font-weight: 600;
    src: local('orbitron'), url(${require('@/assets/fonts/orbitron/Orbitron-Black.ttf')}) format('truetype');
  }

  @font-face {
    font-family: 'orbitron';
    font-weight: 700;
    src: local('orbitron'), url(${require('@/assets/fonts/orbitron/Orbitron-Bold.ttf')}) format('truetype');
  }
`

export default FontFaces
