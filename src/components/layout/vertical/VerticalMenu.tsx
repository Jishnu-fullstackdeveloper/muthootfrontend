'use client'

import { useState, useEffect, useMemo } from 'react'

import { usePathname } from 'next/navigation'

import { useTheme } from '@mui/material/styles'
import PerfectScrollbar from 'react-perfect-scrollbar'

import { Menu, MenuItem } from '@menu/vertical-menu'
import custom_theme_settings from '@/utils/custom_theme_settings.json'
import { useSettings } from '@core/hooks/useSettings'
import useVerticalNav from '@menu/hooks/useVerticalNav'
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import withPermission from '@/hocs/withPermission'

interface MenuItemType {
  path: string
  label: string
  iconClass: string
  permission: string
}

const RenderExpandIcon = ({ open, transitionDuration }: { open: boolean; transitionDuration: number }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

interface VerticalMenuProps {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const VerticalMenu = ({ scrollMenu }: VerticalMenuProps) => {
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { settings } = useSettings()
  const { isBreakpointReached } = useVerticalNav()
  const [clientMenuItems, setClientMenuItems] = useState<MenuItemType[]>([])
  const pathname = usePathname()

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  const staticMenuItems = useMemo(
    () => [
      { path: '/user-management', label: 'User Management', iconClass: 'tabler-users', permission: 'userManagement' },
      { path: '/user-role', label: 'User Roles', iconClass: 'tabler-key', permission: 'userRoles' },
      {
        path: '/approval-management',
        label: 'Approval Management',
        iconClass: 'tabler-rosette-discount-check',
        permission: 'approvalManagement'
      },
      {
        path: '/jd-management',
        label: 'JD Management',
        iconClass: 'tabler-file-description',
        permission: 'jdManagement'
      },
      {
        path: '/vacancy-management',
        label: 'Vacancy Management',
        iconClass: 'tabler-briefcase',
        permission: 'vacancyManagement'
      },
      {
        path: '/recruitment-management/overview',
        label: 'Recruitment Management',
        iconClass: 'tabler-user-plus',
        permission: 'recruitmentManagement'
      },
      {
        path: '/branch-management',
        label: 'Branch Management',
        iconClass: 'tabler-git-merge',
        permission: 'branchManagement'
      },
      {
        path: '/bucket-management',
        label: 'Bucket Management',
        iconClass: 'tabler-apps',
        permission: 'bucketManagement'
      },
      {
        path: '/approval-matrix',
        label: 'Approval Matrix',
        iconClass: 'tabler-settings-check',
        permission: 'approvalMatrix'
      }
    ],
    []
  )

  const isMenuItemActive = (item: MenuItemType) => {
    if (item.path === '/recruitment-management/overview') {
      return pathname.startsWith('/recruitment-management')
    }

    return pathname.startsWith(item.path)
  }

  useEffect(() => {
    const dynamicMenuItems = (custom_theme_settings?.theme?.vertical_menu?.icons || []).map(item => ({
      path: item.path,
      label: item.label,
      iconClass: item.iconClass,
      permission: (item as { permission?: string }).permission || '' // Assert permission as optional
    }))

    setClientMenuItems([...dynamicMenuItems, ...staticMenuItems])
  }, [staticMenuItems])

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            style: { backgroundColor: custom_theme_settings?.theme?.vertical_menu?.backgroundColor || 'white' },
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true),
            style: { backgroundColor: custom_theme_settings?.theme?.vertical_menu?.backgroundColor || 'white' }
          })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => (
          <RenderExpandIcon open={open} transitionDuration={verticalNavOptions.transitionDuration ?? 0} />
        )}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {clientMenuItems.map((item, index) => {
          const MenuItemWithPermission = withPermission(
            () => (
              <MenuItem
                key={index}
                href={isMenuItemActive(item) ? pathname : item.path}
                icon={<i className={item.iconClass} />}
              >
                {item.label}
              </MenuItem>
            ),
            item.permission
          )

          return <MenuItemWithPermission key={index} />
        })}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
