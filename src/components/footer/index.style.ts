import styled from 'styled-components'
import { Text } from '@/contexts/theme/components'

export const FooterContainer = styled.div`
  padding: 0 60px 27px 60px;
  margin-top: 128px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: 1080px) {
    flex-direction: column;
  }
`

export const Copyright = styled(Text)`
  @media screen and (max-width: 1080px) {
    font-size: 3.1vw;
  }
`

export const SocialMediaContainer = styled.div`
  width: 320px;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 1080px) {
    margin-bottom: 10px;
  }
`

export const SocialMedium = styled.a`
  color: #babac0;
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 16px;

  &:not(&:nth-last-of-type(1)) {
    margin-right: 10px;
  }

  img {
    width: 35px;
    height: 35px;
    padding: 3px;

    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 21px;
  }
`
