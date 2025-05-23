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
import { getPermissionRenderConfig } from '@/utils/functions'

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
  const [permissionConfig, setPermissionConfig] = useState<Record<string, string> | null>(null)
  const pathname = usePathname()

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  // Load permissionConfig on mount
  useEffect(() => {
    const config = getPermissionRenderConfig()

    setPermissionConfig(config)
  }, [])

  const staticMenuItems = useMemo(
    () => [
      {
        path: '/home', // Added Home menu item
        label: 'Home',
        iconClass: 'tabler-home',
        permission: 'home',
        read: 'HOME_READ' // Set to match getPermissionRenderConfig key
      },
      {
        path: '/user-management/user',
        label: 'User Management',
        iconClass: 'tabler-users',
        permission: 'userManagement',
        read: 'USER_USER_READ'
      },
      {
        path: '/user-role',
        label: 'User Roles',
        iconClass: 'tabler-key',
        permission: 'userRoles',
        read: 'USER_ROLE_READ'
      },
      {
        path: '/approvals',
        label: 'Approvals',
        iconClass: 'tabler-rosette-discount-check',
        permission: 'approvals',
        read: 'APPROVALS_READ'
      },

      // {
      //   path: '/candidate-management',
      //   label: 'Candidate Management',
      //   iconClass: 'tabler-user-exclamation',
      //   permission: 'candidateManagement'
      // },

      {
        path: '/hiring-management',
        label: 'Hiring Management',
        iconClass: 'tabler-apps'
      },

      {
        path: '/jd-management',
        label: 'JD Management',
        iconClass: 'tabler-file-description',
        permission: 'jdManagement',
        read: 'JD_READ'
      },
      {
        path: '/vacancy-management',
        label: 'Vacancy Management',
        iconClass: 'tabler-briefcase',
        permission: 'vacancyManagement',
        read: 'HIRING_VACANCY_READ'
      },

      {
        path: '/budget-management',
        label: 'Budget Management',
        iconClass: 'tabler-report-money',
        permission: 'budgetManagement',
        read: 'HIRING_BUDGET_READ'
      },

      // {
      //   path: '/recruitment-management/overview',
      //   label: 'Recruitment Management',
      //   iconClass: 'tabler-user-plus',
      //   permission: 'recruitmentManagement',
      //   read: 'recruitment_read'
      // },
      {
        path: '/branch-management',
        label: 'Branch Management',
        iconClass: 'tabler-git-merge',
        permission: 'branchManagement',
        read: 'BRANCH_READ'
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
        iconClass: 'tabler-align-box-bottom-center',
        permission: 'approvalMatrix',
        read: 'SYSTEM_APPROVALMATRIX_READ'
      },
      {
        path: '/employee-management',
        label: 'Employee Management',
        iconClass: 'tabler-users-group',
        permission: 'employeeManagement',
        read: 'USER_EMPLOYEE_READ'
      },
      {
        path: '/system-management',
        label: 'System Management',
        iconClass: 'tabler-settings-check',
        permission: 'systemManagement',
        read: 'GENERAL_CREATE'
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
      permission: (item as { permission?: string }).permission || '',
      read: (item as { read?: string }).read || ''
    }))

    // Combine staticMenuItems with dynamicMenuItems
    setClientMenuItems([...staticMenuItems, ...dynamicMenuItems])
  }, [staticMenuItems])

  // Wait until permissionConfig is loaded before rendering menu items
  if (!permissionConfig) {
    return null // Or a loading spinner/placeholder
  }

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
          // Map the read key to the corresponding permission value using getPermissionRenderConfig
          const individualPermission = item.read && permissionConfig?.[item.read] ? permissionConfig[item.read] : ''

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
            )
          )

          // Invoke the function with individualPermission mapped from getPermissionRenderConfig
          return MenuItemWithPermission({
            individualPermission: individualPermission

            // fallback: <div>Unauthorized</div>,
            // buttonDisable: true
          })
        })}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
