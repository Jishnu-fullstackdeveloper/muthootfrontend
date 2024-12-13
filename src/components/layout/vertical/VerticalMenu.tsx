'use client'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'
import custom_theme_settings from '@/utils/custom_theme_settings.json'

// Component Imports
import { Menu, MenuItem, SubMenu } from '@menu/vertical-menu'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import { usePathname } from 'next/navigation'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { settings } = useSettings()
  const { isBreakpointReached } = useVerticalNav()
  const pathname = usePathname()
  const pathSegments = pathname.split('/').pop()
  const isJDManagementPage = pathname.startsWith('/jd-management/')

  // Vars
  const { transitionDuration } = verticalNavOptions

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            style: {
              backgroundColor: custom_theme_settings?.theme?.vertical_menu?.backgroundColor || 'white'
            },
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true),
            style: {
              backgroundColor: custom_theme_settings?.theme?.vertical_menu?.backgroundColor || 'white'
            }
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {/* the below is the code change */}
        {custom_theme_settings?.theme?.vertical_menu?.icons?.map((menuItem, index) => (
          <MenuItem key={index} href={menuItem.path} icon={<i className={menuItem.iconClass} />}>
            {menuItem.label}
          </MenuItem>
        ))}

        <MenuItem href='/profile' icon={<i className='tabler-info-circle' />}>
          Profile
        </MenuItem>
        {isJDManagementPage ? (
          <MenuItem href={pathname} icon={<i className='tabler-file-description' />}>
            JD Management
          </MenuItem>
        ) : (
          <MenuItem href='/jd-management' icon={<i className='tabler-file-description' />}>
            JD Management
          </MenuItem>
        )}

        <MenuItem href='/addtrip' icon={<i className='tabler-info-circle' />}>
          Add Trip
        </MenuItem>
        <SubMenu label='Components'>
          <MenuItem href='/components/accordion'>Accordion</MenuItem>
          <MenuItem href='/components/alert'>Alert</MenuItem>
          <MenuItem href='/components/appbar'>App Bar</MenuItem>
          <MenuItem href='/components/autocomplete'>Autocomplete</MenuItem>
          <MenuItem href='/components/avatar'>Avatar</MenuItem>
          <MenuItem href='/components/backdrop'>Backdrop</MenuItem>
          <MenuItem href='/components/badge'>Badge</MenuItem>
          <MenuItem href='/components/button'>Button</MenuItem>
          <MenuItem href='/components/card'>Card</MenuItem>
          <MenuItem href='/components/checkbox'>Checkbox</MenuItem>
          <MenuItem href='/components/chip'>Chip</MenuItem>
          <MenuItem href='/components/datepicker'>Datepicker</MenuItem>
          <MenuItem href='/components/dialog'>Dialog</MenuItem>
          <MenuItem href='/components/drawer'>Drawer</MenuItem>
          <MenuItem href='/components/dynamicfloatingactionbutton'>Floating Action Button</MenuItem>
          <MenuItem href='/components/list'>List</MenuItem>
          <MenuItem href='/components/menu'>Menu</MenuItem>
          <MenuItem href='/components/progress'>Progress</MenuItem>
          <MenuItem href='/components/radioGroup'>Radio Group</MenuItem>
          <MenuItem href='/components/select'>Select</MenuItem>
          <MenuItem href='/components/skeleton'>Skeleton</MenuItem>
          <MenuItem href='/components/snackbar'>Snackbar</MenuItem>
          <MenuItem href='/components/speeddial'>Speed Dial</MenuItem>
          <MenuItem href='/components/switch'>Switch</MenuItem>
          <MenuItem href='/components/tab'>Tab</MenuItem>
          <MenuItem href='/components/table'>Table</MenuItem>
          <MenuItem href='/components/textField'>Text Field</MenuItem>
          <MenuItem href='/components/tooltip'>Tooltip</MenuItem>
        </SubMenu>
      </Menu>

      {/* <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <GenerateVerticalMenu menuData={menuData(dictionary, params)} />
      </Menu> */}
    </ScrollWrapper>
  )
}

export default VerticalMenu
