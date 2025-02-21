import { useState } from 'react'

import { Button } from '@mui/material'

type Tab = {
  id: number
  label: string
  content: React.ReactNode
}

interface DynamicTabsProps {
  tabs: Tab[]
}

const DynamicTabs: React.FC<DynamicTabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState<number>(tabs[0]?.id || 0)

  const handleTabClick = (id: number) => {
    setActiveTab(id)
  }

  return (
    <div>
      <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
        {tabs.map(tab => (
          <Button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '4px solid blue' : '2px solid transparent',
              backgroundColor: 'transparent',
              borderRadius: '0'
            }}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <div style={{ padding: '20px' }}>
        {tabs.map(tab => tab.id === activeTab && <div key={tab.id}>{tab.content}</div>)}
      </div>
    </div>
  )
}

export default DynamicTabs
