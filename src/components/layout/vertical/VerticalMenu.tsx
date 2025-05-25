/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect, useMemo } from 'react'
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
import withPermission from '@/hocs/withPermission'
import { getPermissionRenderConfig } from '@/utils/functions'
import { ROUTES } from '@/utils/routes'
import { Accordion, AccordionDetails, AccordionSummary, styled } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

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
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

interface VerticalMenuProps {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: 'none',
  '&:before': {
    display: 'none'
  },
  '&.Mui-expanded': {
    margin: 0
  },
  backgroundColor: 'transparent'
}))

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  minHeight: 'unset',
  padding: 0,
  '& .MuiAccordionSummary-content': {
    margin: 0,
    '&.Mui-expanded': {
      margin: 0
    }
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    marginRight: '0.5rem'
  }
}))

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: 0
}))

const VerticalMenu = ({ scrollMenu }: VerticalMenuProps) => {
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { settings } = useSettings()
  const { isBreakpointReached } = useVerticalNav()
  const [clientMenuItems, setClientMenuItems] = useState<MenuItemType[]>([])
  const [permissionConfig, setPermissionConfig] = useState<Record<string, string> | null>(null)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  // Load permissionConfig on mount
  useEffect(() => {
    const config = getPermissionRenderConfig()
    setPermissionConfig(config)
  }, [])

  // Set initially expanded menu based on current route
  useEffect(() => {
    if (pathname && clientMenuItems.length > 0) {
      const activeParent = clientMenuItems.find(
        item => item.children && item.children.some(child => pathname.startsWith(child.path))
      )
      if (activeParent) {
        setExpandedMenu(activeParent.label)
      }
    }
  }, [pathname, clientMenuItems])

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
        path: '', // Empty path for parent menu items that shouldn't navigate
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
          },
          {
            path: ROUTES.USER_MANAGEMENT.RESIGNED_EMPLOYEE,
            label: 'Resignation',
            iconClass: 'tabler-user-x',
            permission: 'resignedEmployee',
            read: 'USER_RESIGNED_READ'
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
        path: '', // Empty path for parent menu items that shouldn't navigate
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
        path: '', // Empty path for parent menu items that shouldn't navigate
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

  const isMenuItemActive = (item: MenuItemType): boolean => {
    if (item.path === '/recruitment-management/overview') {
      return pathname.startsWith('/recruitment-management')
    }

    if (item.children) {
      return item.children.some(child => isMenuItemActive(child))
    }

    return pathname === item.path || pathname.startsWith(item.path)
  }

  useEffect(() => {
    const dynamicMenuItems = (custom_theme_settings?.theme?.vertical_menu?.icons || []).map((item: any) => ({
      path: item.path,
      label: item.label,
      iconClass: item.iconClass,
      permission: (item as { permission?: string }).permission || '',
      read: (item as { read?: string }).read || ''
    }))

    // Filter out duplicate "Home" from dynamicMenuItems
    const filteredDynamicMenuItems = dynamicMenuItems.filter(
      (item: MenuItemType) => !(item.label === 'Home' && item.path === ROUTES.HOME)
    )

    setClientMenuItems([...staticMenuItems, ...filteredDynamicMenuItems])
  }, [staticMenuItems])

  // Handle accordion change
  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedMenu(isExpanded ? panel : null)
  }

  // Handle menu item click
  const handleMenuItemClick = (path: string) => {
    if (path) {
      router.push(path)
    }
  }

  // Wait until permissionConfig is loaded before rendering menu items
  if (!permissionConfig) {
    return null
  }

  // Render a menu item (with or without submenus)
  const renderMenuItem = (item: MenuItemType, index: number) => {
    const individualPermission = item.read && permissionConfig?.[item.read] ? permissionConfig[item.read] : ''
    const hasChildren = !!item.children
    const isActive = isMenuItemActive(item)

    const MenuItemWithPermission = withPermission((props: { read?: string }) => {
      if (hasChildren) {
        return (
          <StyledAccordion
            key={index}
            expanded={expandedMenu === item.label}
            onChange={handleAccordionChange(item.label)}
            disableGutters
          >
            <StyledAccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${item.label}-content`}
              id={`${item.label}-header`}
            >
              <MenuItem
                icon={<i className={item.iconClass} />}
                {...(props.read && { disabled: true })}
                active={isActive}
                onClick={() => handleMenuItemClick(item.path)}
              >
                {item.label}
              </MenuItem>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Menu
                popoutMenuOffset={{ mainAxis: 23 }}
                menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
                renderExpandIcon={({ open }) => (
                  <RenderExpandIcon open={open} transitionDuration={verticalNavOptions.transitionDuration ?? 0} />
                )}
                renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
                menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
              >
                {item.children?.map((child, childIndex) => renderMenuItem(child, childIndex))}
              </Menu>
            </StyledAccordionDetails>
          </StyledAccordion>
        )
      }

      return (
        <MenuItem
          key={index}
          icon={<i className={item.iconClass} />}
          {...(props.read && { disabled: true })}
          active={isActive}
          onClick={() => handleMenuItemClick(item.path)}
        >
          {item.label}
        </MenuItem>
      )
    })

    return MenuItemWithPermission({
      individualPermission: individualPermission
    })
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
        {clientMenuItems.map((item, index) => renderMenuItem(item, index))}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
