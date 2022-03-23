import { css } from 'styled-components'

const FontFaces = css`
  @font-face {
    font-weight: 300;
    font-family: 'gilroy';
    src: local('gilroy'), url(${require('@/assets/fonts/gilroy/Gilroy-Light.ttf')}) format('truetype');
  }
  @font-face {
    font-weight: 400;
    font-family: 'gilroy';
    src: local('gilroy'), url(${require('@/assets/fonts/gilroy/Gilroy-Regular.ttf')}) format('truetype');
  }
  @font-face {
    font-weight: 500;
    font-family: 'gilroy';
    src: local('gilroy'), url(${require('@/assets/fonts/gilroy/Gilroy-Medium.ttf')}) format('truetype');
  }
  @font-face {
    font-family: 'gilroy';
    font-weight: 600;
    src: local('gilroy'), url(${require('@/assets/fonts/gilroy/Gilroy-SemiBold.ttf')}) format('truetype');
  }
  @font-face {
    font-family: 'gilroy';
    font-weight: 700;
    src: local('gilroy'), url(${require('@/assets/fonts/gilroy/Gilroy-Bold.ttf')}) format('truetype');
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
