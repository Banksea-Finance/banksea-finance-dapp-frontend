import React, { useMemo } from 'react'
import { Copyright, FooterContainer, SocialMediaContainer, SocialMedium } from '@/components/footer/index.style'
import Logo from '@/components/logo'
import { useThemeWrapper } from '@/contexts/theme-wrapper'
import { useResponsive } from '@/contexts/theme/hooks'

export type SocialMedium = {
  icon: string
  to: string
}

const Footer: React.FC = () => {
  const { themeType } = useThemeWrapper()
  const { isDesktop } = useResponsive()

  const SOCIAL_MEDIA: SocialMedium[] = useMemo(
    () => [
      { to: 'https://twitter.com/banksea_finance', icon: require('@/assets/images/social-media-logos/twitter.svg') },
      { to: 'https://t.me/banksea_finance', icon: require('@/assets/images/social-media-logos/telegram.svg') },
      { to: 'https://discord.com/invite/NdRGt4BDFe', icon: require('@/assets/images/social-media-logos/discord.svg') },
      { to: 'mailto://contact@banksea.finance', icon: require('@/assets/images/social-media-logos/email.svg') }
    ],
    [themeType]
  )

  return (
    <FooterContainer>
      {isDesktop && <Logo width={'320px'} />}

      <SocialMediaContainer>
        {SOCIAL_MEDIA.map(({ icon, to }, index) => (
          <SocialMedium href={to} key={index}>
            <img src={icon} alt={to} />
          </SocialMedium>
        ))}
      </SocialMediaContainer>
      <Copyright>@2022 Banksea - All rights reserved</Copyright>
    </FooterContainer>
  )
}

export default Footer
