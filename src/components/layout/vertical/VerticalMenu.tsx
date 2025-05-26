/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from '@mui/material/styles'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Menu, MenuItem } from '@menu/vertical-menu'
import custom_theme_settings from '@/utils/custom_theme_settings.json'
import { useSettings } from '@core/hooks/useSettings'
import useVerticalNav from '@menu/hooks/useVerticalNav'
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import { ROUTES } from '@/utils/routes'
import { List, ListItem, Collapse, IconButton } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import withPermission from '@/hocs/withPermission'
import { getPermissionRenderConfig } from '@/utils/functions'

interface MenuItemType {
  path: string
  label: string
  iconClass: string
  permission: string
  read?: string
  children?: MenuItemType[]
}

const RenderExpandIcon = ({ open, transitionDuration }: { open: boolean; transitionDuration: number }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <ChevronRightIcon />
  </StyledVerticalNavExpandIcon>
)

interface VerticalMenuProps {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

// Wrap MenuItem with withPermission HOC
const MenuItemWithPermission = withPermission(MenuItem)

const VerticalMenu = ({ scrollMenu }: VerticalMenuProps) => {
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { settings } = useSettings()
  const { isBreakpointReached } = useVerticalNav()
  const [clientMenuItems, setClientMenuItems] = useState<MenuItemType[]>([])
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]) // Track expanded menu items
  const pathname = usePathname()
  const router = useRouter()

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  // Get the permission mapping
  const permissionConfig = getPermissionRenderConfig()

  // Static menu items definition
  const staticMenuItems = useMemo(
    () => [
      {
        path: ROUTES.HOME,
        label: 'Home',
        iconClass: 'tabler-home',
        permission: 'home',
        read: 'HOME_READ'
      },
      {
        path: '',
        label: 'User Management',
        iconClass: 'tabler-users',
        permission: 'userManagement',
        read: 'USER_USER_READ',
        children: [
          {
            path: ROUTES.USER_MANAGEMENT.USER,
            label: 'User',
            iconClass: 'tabler-user',
            permission: 'userManagement',
            read: 'USER_USER_READ'
          },
          {
            path: ROUTES.USER_MANAGEMENT.ROLE,
            label: 'Role',
            iconClass: 'tabler-key',
            permission: 'userRoles',
            read: 'USER_ROLE_READ'
          },
          {
            path: ROUTES.USER_MANAGEMENT.EMPLOYEE,
            label: 'Employee Management',
            iconClass: 'tabler-users-group',
            permission: 'employeeManagement',
            read: 'USER_EMPLOYEE_READ'
          }
        ]
      },
      {
        path: ROUTES.APPROVALS,
        label: 'Approvals',
        iconClass: 'tabler-rosette-discount-check',
        permission: 'approvals',
        read: 'APPROVALS_READ'
      },
      {
        path: '',
        label: 'Hiring Management',
        iconClass: 'tabler-apps',
        permission: 'hiringManagement',
        read: 'HIRING_READ',
        children: [
          {
            path: ROUTES.HIRING_MANAGEMENT.JOB_POSTING,
            label: 'Job Posting',
            iconClass: 'tabler-file-text',
            permission: 'jobPosting',
            read: 'HIRING_JOBPOSTING_READ'
          },
          {
            path: ROUTES.HIRING_MANAGEMENT.INTERVIEW_MANAGEMENT,
            label: 'Interview Management',
            iconClass: 'tabler-calendar-event',
            permission: 'interviewManagement',
            read: 'HIRING_INTERVIEW_READ'
          },
          {
            path: ROUTES.HIRING_MANAGEMENT.CV_POOL,
            label: 'CV Pool',
            iconClass: 'tabler-files',
            permission: 'cvPool',
            read: 'HIRING_CVPOOL_READ'
          },
          {
            path: ROUTES.HIRING_MANAGEMENT.ONBOARDING,
            label: 'Onboarding',
            iconClass: 'tabler-user-check',
            permission: 'onboarding',
            read: 'HIRING_ONBOARDING_READ'
          },
          {
            path: ROUTES.USER_MANAGEMENT.RESIGNED_EMPLOYEE,
            label: 'Resignation',
            iconClass: 'tabler-user-x',
            permission: 'resignedEmployee',
            read: 'USER_RESIGNED_READ'
          },
          {
            path: ROUTES.HIRING_MANAGEMENT.VACANCY,
            label: 'Vacancy',
            iconClass: 'tabler-briefcase',
            permission: 'vacancyManagement',
            read: 'HIRING_VACANCY_READ'
          },
          {
            path: ROUTES.HIRING_MANAGEMENT.BUDGET,
            label: 'Budget Management',
            iconClass: 'tabler-report-money',
            permission: 'budgetManagement',
            read: 'HIRING_BUDGET_READ'
          }
        ]
      },
      {
        path: ROUTES.JD_MANAGEMENT,
        label: 'JD Management',
        iconClass: 'tabler-file-description',
        permission: 'jdManagement',
        read: 'JD_READ'
      },
      {
        path: ROUTES.BRANCH_MANAGEMENT,
        label: 'Branch Management',
        iconClass: 'tabler-git-merge',
        permission: 'branchManagement',
        read: 'BRANCH_READ'
      },
      {
        path: '',
        label: 'System Management',
        iconClass: 'tabler-settings-check',
        permission: 'systemManagement',
        read: 'GENERAL_CREATE',
        children: [
          {
            path: ROUTES.SYSTEM_MANAGEMENT.X_FACTOR.RESIGNED_X_FACTOR,
            label: 'X-Factor',
            iconClass: 'tabler-star',
            permission: 'xFactor',
            read: 'SYSTEM_READ',
            children: [
              {
                path: ROUTES.SYSTEM_MANAGEMENT.X_FACTOR.RESIGNED_X_FACTOR,
                label: 'Resigned X-Factor',
                iconClass: 'tabler-user-x',
                permission: 'resignedXFactor',
                read: 'SYSTEM_RESIGNEDXFACTOR_READ'
              },
              {
                path: ROUTES.SYSTEM_MANAGEMENT.X_FACTOR.VACANCY_X_FACTOR,
                label: 'Vacancy X-Factor',
                iconClass: 'tabler-briefcase',
                permission: 'vacancyXFactor',
                read: 'SYSTEM_VACANCYXFACTOR_READ'
              }
            ]
          },
          {
            path: ROUTES.SYSTEM_MANAGEMENT.DATA_UPLOAD,
            label: 'Data Upload',
            iconClass: 'tabler-upload',
            permission: 'dataUpload',
            read: 'SYSTEM_DATAUPLOAD_READ'
          },
          {
            path: ROUTES.SYSTEM_MANAGEMENT.APPROVAL_CATEGORY,
            label: 'Approval Category',
            iconClass: 'tabler-category',
            permission: 'approvalCategory',
            read: 'SYSTEM_APPROVALCATEGORY_READ'
          },
          {
            path: ROUTES.SYSTEM_MANAGEMENT.ORGANIZATIONAL_MAPPING,
            label: 'Organizational Mapping',
            iconClass: 'tabler-sitemap',
            permission: 'organizationalMapping',
            read: 'SYSTEM_ORGANIZATIONALMAPPING_READ'
          },
          {
            path: ROUTES.SYSTEM_MANAGEMENT.APPROVAL_MATRIX,
            label: 'Approval Matrix',
            iconClass: 'tabler-align-box-bottom-center',
            permission: 'approvalMatrix',
            read: 'SYSTEM_APPROVALMATRIX_READ'
          },
          {
            path: ROUTES.SYSTEM_MANAGEMENT.SCHEDULER,
            label: 'Scheduler',
            iconClass: 'tabler-clock',
            permission: 'scheduler',
            read: 'SYSTEM_SCHEDULER_READ'
          },
          {
            path: ROUTES.SYSTEM_MANAGEMENT.INTERVIEW_CUSTOMIZATION,
            label: 'Interview Customization',
            iconClass: 'tabler-settings',
            permission: 'interviewCustomization',
            read: 'SYSTEM_READ'
          }
        ]
      }
    ],
    []
  )

  // Initialize menu items once
  useEffect(() => {
    if (clientMenuItems.length > 0) return

    const dynamicMenuItems = (custom_theme_settings?.theme?.vertical_menu?.icons || []).map((item: any) => ({
      path: item.path,
      label: item.label,
      iconClass: item.iconClass,
      permission: item.permission || '',
      read: item.read || ''
    }))

    const filteredDynamicMenuItems = dynamicMenuItems.filter(
      (item: MenuItemType) => !(item.label === 'Home' && item.path === ROUTES.HOME)
    )

    setClientMenuItems([...staticMenuItems, ...filteredDynamicMenuItems])
  }, [staticMenuItems, clientMenuItems.length])

  // Check if a menu item is active
  const isMenuItemActive = useCallback(
    (item: MenuItemType): boolean => {
      if (!pathname) return false

      if (item.path === '/recruitment-management/overview') {
        return pathname.startsWith('/recruitment-management')
      }

      if (item.children) {
        return item.children.some(child => isMenuItemActive(child))
      }

      return pathname === item.path || pathname.startsWith(item.path)
    },
    [pathname]
  )

  // Toggle submenu expansion
  const toggleMenu = useCallback((label: string) => {
    setExpandedMenus(prev => (prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]))
  }, [])

  // Handle navigation
  const handleNavigation = useCallback(
    (path: string) => {
      if (path) {
        router.push(path)
      }
    },
    [router]
  )

  // Early return if loading
  if (clientMenuItems.length === 0) {
    return null
  }

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            style: { backgroundColor: custom_theme_settings?.theme?.vertical_menu?.backgroundColor || 'white' },
            onScroll: (container: any) => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: (container: any) => scrollMenu(container, true),
            style: { backgroundColor: custom_theme_settings?.theme?.vertical_menu?.backgroundColor || 'white' }
          })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => (
          <RenderExpandIcon open={open} transitionDuration={verticalNavOptions.transitionDuration ?? 0} />
        )}
        renderExpandedMenuItemIcon={{ icon: <ChevronRightIcon fontSize='small' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <List disablePadding>
          {clientMenuItems.map((item, index) => {
            const isActive = isMenuItemActive(item)
            const hasChildren = !!item.children
            const isExpanded = expandedMenus.includes(item.label)
            // Map the read key to the corresponding permission value
            const permissionValue = item.read ? permissionConfig[item.read] || '' : ''

            return (
              <div key={`${item.label}-${index}`}>
                {/* Main menu item */}
                <ListItem disablePadding>
                  <MenuItemWithPermission
                    icon={<i className={item.iconClass} />}
                    active={isActive}
                    individualPermission={permissionValue}
                    suffix={
                      hasChildren ? (
                        <IconButton
                          onClick={e => {
                            e.stopPropagation() // Prevent navigation when clicking the icon
                            toggleMenu(item.label)
                          }}
                        >
                          {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                        </IconButton>
                      ) : null
                    }
                    onClick={() => {
                      if (!hasChildren) {
                        handleNavigation(item.path) // Navigate if it's a leaf item
                      }
                    }}
                  >
                    {item.label}
                  </MenuItemWithPermission>
                </ListItem>

                {/* Submenu (if any) */}
                {hasChildren && (
                  <Collapse in={isExpanded} timeout='auto' unmountOnExit>
                    <List disablePadding sx={{ pl: 4 }}>
                      {item.children?.map((child, childIndex) => {
                        const childIsActive = isMenuItemActive(child)
                        const childHasChildren = !!child.children
                        const childIsExpanded = expandedMenus.includes(child.label)
                        // Map the read key to the corresponding permission value for child
                        const childPermissionValue = child.read ? permissionConfig[child.read] || '' : ''

                        return (
                          <div key={`${child.label}-${childIndex}`}>
                            {/* Submenu item (Level 1) */}
                            <ListItem disablePadding>
                              <MenuItemWithPermission
                                icon={<i className={child.iconClass} />}
                                active={childIsActive}
                                individualPermission={childPermissionValue}
                                suffix={
                                  childHasChildren ? (
                                    <IconButton
                                      onClick={e => {
                                        e.stopPropagation()
                                        toggleMenu(child.label)
                                      }}
                                    >
                                      {childIsExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                                    </IconButton>
                                  ) : null
                                }
                                onClick={() => {
                                  if (!childHasChildren) {
                                    handleNavigation(child.path) // Navigate if it's a leaf item
                                  }
                                }}
                              >
                                {child.label}
                              </MenuItemWithPermission>
                            </ListItem>

                            {/* Nested submenu (Level 2, e.g., under X-Factor) */}
                            {childHasChildren && (
                              <Collapse in={childIsExpanded} timeout='auto' unmountOnExit>
                                <List disablePadding sx={{ pl: 4 }}>
                                  {child.children?.map((nestedChild, nestedIndex) => {
                                    const nestedIsActive = isMenuItemActive(nestedChild)
                                    // Map the read key to the corresponding permission value for nested child
                                    const nestedPermissionValue = nestedChild.read
                                      ? permissionConfig[nestedChild.read] || ''
                                      : ''

                                    return (
                                      <ListItem key={`${nestedChild.label}-${nestedIndex}`} disablePadding>
                                        <MenuItemWithPermission
                                          icon={<i className={nestedChild.iconClass} />}
                                          active={nestedIsActive}
                                          individualPermission={nestedPermissionValue}
                                          onClick={() => handleNavigation(nestedChild.path)}
                                        >
                                          {nestedChild.label}
                                        </MenuItemWithPermission>
                                      </ListItem>
                                    )
                                  })}
                                </List>
                              </Collapse>
                            )}
                          </div>
                        )
                      })}
                    </List>
                  </Collapse>
                )}
              </div>
            )
          })}
        </List>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
