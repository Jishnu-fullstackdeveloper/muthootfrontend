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
  read?: string // Updated to optional string for individualPermission
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
      {
        path: '/user-management',
        label: 'User Management',
        iconClass: 'tabler-users',
        permission: 'userManagement',
        read: 'user_read'
      },
      { path: '/user-role', label: 'User Roles', iconClass: 'tabler-key', permission: 'userRoles', read: 'role_read' },
      {
        path: '/approval-management',
        label: 'Approval Management',
        iconClass: 'tabler-rosette-discount-check',
        permission: 'approvalManagement',
        read: 'approval_read'
      },

      // {
      //   path: '/candidate-management',
      //   label: 'Candidate Management',
      //   iconClass: 'tabler-user-exclamation',
      //   permission: 'candidateManagement'
      // },

      {
        path: '/jd-management',
        label: 'JD Management',
        iconClass: 'tabler-file-description',
        permission: 'jdManagement',
        read: 'jd_read'
      },
      {
        path: '/vacancy-management',
        label: 'Vacancy Management',
        iconClass: 'tabler-briefcase',
        permission: 'vacancyManagement',
        read: 'vacancy_read'
      },
      {
        path: '/recruitment-management/overview',
        label: 'Recruitment Management',
        iconClass: 'tabler-user-plus',
        permission: 'recruitmentManagement',
        read: 'recruitment_read'
      },
      {
        path: '/branch-management',
        label: 'Branch Management',
        iconClass: 'tabler-git-merge',
        permission: 'branchManagement',
        read: 'branch_read'
      },

      // {
      //   path: '/bucket-management',
      //   label: 'Bucket Management',
      //   iconClass: 'tabler-apps',
      //   permission: 'bucketManagement',
      //   read: 'bucket_read'
      // },
      {
        path: '/approval-matrix',
        label: 'Approval Matrix',
        iconClass: 'tabler-settings-check',
        permission: 'approvalMatrix',
        read: 'approvalmatrix_read'
      },
      {
        path: '/employee-management',
        label: 'Employee Management',
        iconClass: 'tabler-settings-check',
        permission: 'employeeManagement',
        read: 'employeeManagement_read'
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
      permission: (item as { permission?: string }).permission || '', // Assert permission as optional
      read: (item as { read?: string }).read || '' // Add read as optional
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
          // Create the permission-wrapped component
          const MenuItemWithPermission = withPermission(
            (
              props: { read?: string } // Type the props to include read
            ) => (
              <MenuItem
                key={index}
                href={isMenuItemActive(item) ? pathname : item.path}
                icon={<i className={item.iconClass} />}
                {...(props.read && { disabled: true })} // Disable if read is provided (e.g., non-empty string)
              >
                {item.label}
              </MenuItem>
            ),
            item.permission // Use permission from permissionsMap
          )

          // Invoke the function with individualPermission as item.read
          return MenuItemWithPermission({
            individualPermission: item.read || ''

            // fallback: <div>Unauthorized</div>,
            // buttonDisable: true
          })
        })}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
