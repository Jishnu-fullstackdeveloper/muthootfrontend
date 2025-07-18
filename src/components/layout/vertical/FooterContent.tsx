'use client'

// Next Imports
// import Link from 'next/link'

// Third-party Imports
// import classnames from 'classnames'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import useHorizontalNav from '@menu/hooks/useHorizontalNav'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
// import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
// import custom_theme_settings from '@/utils/custom_theme_settings.json'

const FooterContent = () => {
  // Hooks
  const { settings } = useSettings()
  const { isBreakpointReached: isVerticalBreakpointReached } = useVerticalNav()
  const { isBreakpointReached: isHorizontalBreakpointReached } = useHorizontalNav()

  // Vars
  // const isBreakpointReached =
  settings.layout === 'vertical' ? isVerticalBreakpointReached : isHorizontalBreakpointReached

  return (
    <></>

    // <div
    //   className={classnames(verticalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
    //   style={{ backgroundColor: custom_theme_settings?.footer?.backgroundColor }}
    // >
    //   <p style={{ color: custom_theme_settings?.footer?.textColor }}>
    //     <span>{`© ${new Date().getFullYear()}, Made with `}</span>
    //     <span>{`❤️`}</span>
    //     <span>{` by `}</span>
    //     <Link
    //       href='https://pixinvent.com'
    //       target='_blank'
    //       style={{ color: custom_theme_settings?.footer?.linksColor }}
    //       className='uppercase'
    //     >
    //       Pixinvent
    //     </Link>
    //   </p>
    //   {!isBreakpointReached && (
    //     <div className='flex items-center gap-4'>
    //       <Link
    //         href='https://themeforest.net/licenses/standard'
    //         target='_blank'
    //         style={{ color: custom_theme_settings?.footer?.linksColor }}
    //       >
    //         License
    //       </Link>
    //       <Link
    //         href='https://themeforest.net/user/pixinvent/portfolio'
    //         target='_blank'
    //         style={{ color: custom_theme_settings?.footer?.linksColor }}
    //       >
    //         More Themes
    //       </Link>
    //       <Link
    //         href='https://demos.pixinvent.com/vuexy-nextjs-admin-template/documentation'
    //         target='_blank'
    //         style={{ color: custom_theme_settings?.footer?.linksColor }}
    //       >
    //         Documentation
    //       </Link>
    //       <Link
    //         href='https://pixinvent.ticksy.com'
    //         target='_blank'
    //         style={{ color: custom_theme_settings?.footer?.linksColor }}
    //       >
    //         Support
    //       </Link>
    //     </div>
    //   )}
    // </div>
  )
}

export default FooterContent
