'use client'

import DynamicTabs from '@/components/Tab/dynamicTab'

const HomePage = () => {
  const tabs = [
    {
      id: 1,
      label: 'Tab 1',
      content: <p>This is content for Tab 1.</p>
    },
    {
      id: 2,
      label: 'Tab 2',
      content: <p>This is content for Tab 2.</p>
    },
    {
      id: 3,
      label: 'Tab 3',
      content: <p>This is content for Tab 3.</p>
    }
  ]

  return (
    <div>
      <DynamicTabs tabs={tabs} />
    </div>
  )
}

export default HomePage
