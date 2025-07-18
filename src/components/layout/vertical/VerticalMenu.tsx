/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import { useTheme } from '@mui/material/styles'
import PerfectScrollbar from 'react-perfect-scrollbar'

import { List, ListItem, Collapse, IconButton, Box } from '@mui/material'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import { Menu, MenuItem } from '@menu/vertical-menu'
import custom_theme_settings from '@/utils/custom_theme_settings.json'
import { useSettings } from '@core/hooks/useSettings'
import useVerticalNav from '@menu/hooks/useVerticalNav'
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import { ROUTES } from '@/utils/routes'

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
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const pathname = usePathname()
  const router = useRouter()

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  // Static menu items definition
  const staticMenuItems = useMemo(
    () => [
      {
        path: ROUTES.HOME,
        label: 'Dashboard',
        iconClass: 'tabler-home',
        permission: 'home',
        read: 'HOME_READ'
      },
      {
        path: ROUTES.RECRUITMENT_HR,
        label: 'Recruitment HR',
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
            label: 'Employee',
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
            path: ROUTES.HIRING_MANAGEMENT.RESIGNED_EMPLOYEE,
            label: 'Resignation',
            iconClass: 'tabler-user-x',
            permission: 'resignedEmployee',
            read: 'HIRING_RESIGNATION_READ'
          },
          {
            path: ROUTES.HIRING_MANAGEMENT.VACANCY_MANAGEMENT.VACANCY_LIST,
            label: 'Vacancy Management',
            iconClass: 'tabler-briefcase', // still appropriate for the main category
            permission: 'vacancyManagement',
            read: 'HIRING_VACANCY_READ'

            // children: [
            //   {
            //     path: ROUTES.HIRING_MANAGEMENT.VACANCY_MANAGEMENT.VACANCY_LIST,
            //     label: 'Vacancy List',
            //     iconClass: 'tabler-list-details', // better suited for a listing page
            //     permission: 'vacancyList',
            //     read: 'HIRING_VACANCY_VACANCYLIST_READ'
            //   },
            //   {
            //     path: ROUTES.HIRING_MANAGEMENT.VACANCY_MANAGEMENT.VACANCY_REQUEST,
            //     label: 'Vacancy Request',
            //     iconClass: 'tabler-file-plus', // represents request/adding new vacancy
            //     permission: 'vacancyRequest',
            //     read: 'HIRING_VACANCY_VACANCYREQUEST_READ'
            //   }
            // ]
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
        read: 'SYSTEM_READ',
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
                read: 'SYSTEM_XFACTOR_RESIGNEDXFACTOR_READ'
              },
              {
                path: ROUTES.SYSTEM_MANAGEMENT.X_FACTOR.VACANCY_X_FACTOR,
                label: 'Vacancy X-Factor',
                iconClass: 'tabler-briefcase',
                permission: 'vacancyXFactor',
                read: 'SYSTEM_XFACTOR_VACANCYXFACTOR_READ'
              },
              {
                path: ROUTES.SYSTEM_MANAGEMENT.X_FACTOR.NOTICE_PERIOD,
                label: 'Notice Period',
                iconClass: 'tabler-calendar-time',
                permission: 'noticePeriodRange',
                read: 'SYSTEM_XFACTOR_NOTICEPERIODRANGE_READ'
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

          // {
          //   path: ROUTES.SYSTEM_MANAGEMENT.APPROVAL_CATEGORY,
          //   label: 'Approval Category',
          //   iconClass: 'tabler-category',
          //   permission: 'approvalCategory',
          //   read: 'SYSTEM_APPROVALCATEGORY_READ'
          // },
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

  // Check if a menu item is active based on current path
  const isMenuItemActive = useCallback(
    (item: MenuItemType): boolean => {
      if (!pathname) return false

      // Direct match
      if (item.path && pathname === item.path) return true

      // Check if current path starts with item path (for nested routes)
      if (item.path && pathname.startsWith(item.path)) return true

      // Check children recursively
      if (item.children) {
        return item.children.some(child => isMenuItemActive(child))
      }

      return false
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

  // Automatically expand parent menus when child is active
  useEffect(() => {
    const findActiveParents = (items: MenuItemType[], activePath: string): string[] => {
      const parents: string[] = []

      const findParents = (items: MenuItemType[]): boolean => {
        return items.some(item => {
          if (item.path === activePath) return true

          if (item.children) {
            const childActive = findParents(item.children)

            if (childActive) {
              parents.push(item.label)

              return true
            }
          }

          return false
        })
      }

      findParents(items)

      return parents
    }

    if (pathname) {
      const activeParents = findActiveParents(clientMenuItems, pathname)

      setExpandedMenus(prev => [...new Set([...prev, ...activeParents])])
    }
  }, [pathname, clientMenuItems])

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
        menuItemStyles={{
          ...menuItemStyles(verticalNavOptions, theme, settings),
          button: {
            width: '100%',
            justifyContent: 'flex-start',
            padding: '1px 2px',
            borderRadius: '6px',

            // margin: '2px 8px',
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            },
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.common.white,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark
              }
            }
          }
        }}
        renderExpandIcon={({ open }) => (
          <RenderExpandIcon open={open} transitionDuration={verticalNavOptions.transitionDuration ?? 0} />
        )}
        renderExpandedMenuItemIcon={{ icon: <ChevronRightIcon fontSize='small' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <List
          disablePadding
          sx={{
            width: '100%',
            padding: '8px'
          }}
        >
          {clientMenuItems.map((item, index) => {
            const isActive = isMenuItemActive(item)
            const hasChildren = !!item.children
            const isExpanded = expandedMenus.includes(item.label)
            const permissionValue = item.read ? getPermissionRenderConfig()?.[item.read] || '' : ''

            return (
              <Box key={`${item.label}-${index}`} sx={{ mb: '4px' }}>
                {/* Main menu item */}
                <ListItem
                  disablePadding
                  sx={{
                    width: '100%',
                    borderRadius: '6px',
                    alignItems: 'center',
                    backgroundColor: isActive ? custom_theme_settings?.theme?.primaryColor : 'inherit',
                    color: isActive ? custom_theme_settings?.theme?.colors.buttonText : 'inherit'
                  }}
                >
                  <MenuItemWithPermission
                    icon={<i className={item.iconClass} />}
                    selected={isActive}
                    individualPermission={permissionValue}
                    suffix={
                      hasChildren ? (
                        <IconButton
                          size='small'
                          onClick={e => {
                            e.stopPropagation()
                            toggleMenu(item.label)
                          }}
                          sx={{
                            marginLeft: 'auto',
                            color: isActive ? custom_theme_settings?.theme?.primaryColor : 'inherit'
                          }}
                        >
                          {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                        </IconButton>
                      ) : null
                    }
                    onClick={() => {
                      if (hasChildren) {
                        toggleMenu(item.label)
                      } else {
                        handleNavigation(item.path)
                      }
                    }}
                    sx={{
                      width: '100%',
                      '&:hover': {
                        backgroundColor: isActive
                          ? custom_theme_settings?.theme?.primaryColor
                          : theme.palette.action.hover
                      }
                    }}
                  >
                    {item.label}
                  </MenuItemWithPermission>
                </ListItem>

                {/* Submenu (if any) */}
                {hasChildren && (
                  <Collapse in={isExpanded} timeout='auto' unmountOnExit>
                    <List disablePadding sx={{ pl: 3, width: '100%' }}>
                      {item.children?.map((child, childIndex) => {
                        const childIsActive = isMenuItemActive(child)
                        const childHasChildren = !!child.children
                        const childIsExpanded = expandedMenus.includes(child.label)
                        const childPermissionValue = child.read ? getPermissionRenderConfig()?.[child.read] || '' : ''

                        return (
                          <Box key={`${child.label}-${childIndex}`} sx={{ mb: '4px' }}>
                            {/* Submenu item (Level 1) */}
                            <ListItem disablePadding sx={{ width: '100%' }}>
                              <MenuItemWithPermission
                                icon={<i className={child.iconClass} />}
                                selected={childIsActive}
                                individualPermission={childPermissionValue}
                                suffix={
                                  childHasChildren ? (
                                    <IconButton
                                      size='small'
                                      onClick={e => {
                                        e.stopPropagation()
                                        toggleMenu(child.label)
                                      }}
                                      sx={{
                                        marginLeft: 'auto',
                                        color: childIsActive ? custom_theme_settings?.theme?.primaryColor : 'inherit'
                                      }}
                                    >
                                      {childIsExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                                    </IconButton>
                                  ) : null
                                }
                                onClick={() => {
                                  if (childHasChildren) {
                                    toggleMenu(child.label)
                                  } else {
                                    handleNavigation(child.path)
                                  }
                                }}
                                sx={{
                                  width: '100%',
                                  '&:hover': {
                                    backgroundColor: childIsActive
                                      ? theme.palette.primary.dark
                                      : theme.palette.action.hover
                                  }
                                }}
                              >
                                {child.label}
                              </MenuItemWithPermission>
                            </ListItem>

                            {/* Nested submenu (Level 2) */}
                            {childHasChildren && (
                              <Collapse in={childIsExpanded} timeout='auto' unmountOnExit>
                                <List disablePadding sx={{ pl: 3, width: '100%' }}>
                                  {child.children?.map((nestedChild, nestedIndex) => {
                                    const nestedIsActive = isMenuItemActive(nestedChild)

                                    const nestedPermissionValue = nestedChild.read
                                      ? getPermissionRenderConfig()?.[nestedChild.read] || ''
                                      : ''

                                    return (
                                      <ListItem
                                        key={`${nestedChild.label}-${nestedIndex}`}
                                        disablePadding
                                        sx={{ width: '100%' }}
                                      >
                                        <MenuItemWithPermission
                                          icon={<i className={nestedChild.iconClass} />}
                                          selected={nestedIsActive}
                                          individualPermission={nestedPermissionValue}
                                          onClick={() => handleNavigation(nestedChild.path)}
                                          sx={{
                                            width: '100%',
                                            '&:hover': {
                                              backgroundColor: nestedIsActive
                                                ? theme.palette.primary.dark
                                                : theme.palette.action.hover
                                            }
                                          }}
                                        >
                                          {nestedChild.label}
                                        </MenuItemWithPermission>
                                      </ListItem>
                                    )
                                  })}
                                </List>
                              </Collapse>
                            )}
                          </Box>
                        )
                      })}
                    </List>
                  </Collapse>
                )}
              </Box>
            )
          })}
        </List>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
