'use client'
import React, { useCallback, useEffect, useState } from 'react'

import type { Connection, Edge, Node, NodeProps } from 'reactflow'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  ReactFlowProvider
} from 'reactflow'

import 'reactflow/dist/style.css'

const roles = ['CEO', 'CTO', 'CFO', 'Manager', 'Engineer', 'HR']

// Editable dropdown node
export function CustomNode({ data, selected, id }: NodeProps) {
  const shape = data.shape || 'rectangle'
  const base = 'p-2 text-sm text-center shadow border'

  const shapeStyles: Record<string, string> = {
    rectangle: 'rounded bg-white w-32 h-16',
    circle: 'rounded-full bg-blue-100 w-20 h-20 flex items-center justify-center',
    diamond: 'w-20 h-20 bg-green-100 rotate-45 flex items-center justify-center'
  }

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    data.onChange?.(id, e.target.value)
  }

  return (
    <div
      className={`${base} ${shapeStyles[shape]} ${selected ? 'ring-2 ring-blue-400' : ''}`}
      style={{ transform: shape === 'diamond' ? 'rotate(-45deg)' : 'none' }}
    >
      <Handle type='target' position={Position.Top} />
      <div style={{ transform: shape === 'diamond' ? 'rotate(45deg)' : 'none' }}>
        <select
          value={data.label}
          onChange={onChange}
          className='w-full text-center bg-transparent outline-none font-medium'
        >
          <option value=''>Select Role</option>
          {data.options.map((role: string) => (
            <option key={role} value={role} disabled={data.usedRoles.includes(role)}>
              {role}
            </option>
          ))}
        </select>
      </div>
      <Handle type='source' position={Position.Bottom} />
    </div>
  )
}

const nodeTypes = { custom: CustomNode }

let id = 1
const getId = () => `${++id}`

interface OrgChartCanvasProps {
  onSave: (chartData: any) => void
  initialChart: any | null
}

export default function OrgChartCanvas({ onSave, initialChart }: OrgChartCanvasProps) {
  const [usedRoles, setUsedRoles] = useState<string[]>([])

  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialChart?.nodes || [
      {
        id: '1',
        position: { x: 100, y: 100 },
        data: {
          label: '',
          shape: 'rectangle',
          options: roles,
          usedRoles: [],
          onChange: () => {}
        },
        type: 'custom'
      }
    ]
  )

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialChart?.edges || [])

  const onConnect = useCallback((params: Edge | Connection) => setEdges(eds => addEdge(params, eds)), [])

  const updateNodeLabel = (id: string, newLabel: string) => {
    setUsedRoles(prev => {
      const newUsed = [...prev]
      const prevLabel = nodes.find(n => n.id === id)?.data.label

      if (prevLabel) newUsed.splice(newUsed.indexOf(prevLabel), 1)
      if (newLabel && !newUsed.includes(newLabel)) newUsed.push(newLabel)

      return newUsed
    })

    setNodes(nds =>
      nds.map(node =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                label: newLabel,
                usedRoles,
                onChange: updateNodeLabel
              }
            }
          : node
      )
    )
  }

  const addNode = (shape: string) => {
    const newNode: Node = {
      id: getId(),
      type: 'custom',
      data: {
        label: '',
        shape,
        options: roles,
        usedRoles,
        onChange: updateNodeLabel
      },
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100
      }
    }

    setNodes(nds => [...nds, newNode])
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selectedNodeIds = nodes.filter(n => n.selected).map(n => n.id)
        const removedLabels = nodes.filter(n => selectedNodeIds.includes(n.id)).map(n => n.data.label)

        setUsedRoles(prev => prev.filter(role => !removedLabels.includes(role)))

        setNodes(nds => nds.filter(n => !selectedNodeIds.includes(n.id)))
        setEdges(eds => eds.filter(edge => !edge.selected))
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nodes, setNodes, setEdges])

  useEffect(() => {
    setNodes(nds =>
      nds.map(node => ({
        ...node,
        data: {
          ...node.data,
          usedRoles,
          onChange: updateNodeLabel
        }
      }))
    )
  }, [usedRoles])

  useEffect(() => {
    if (initialChart) {
      setUsedRoles(initialChart.nodes.map((node: any) => node.data.label).filter((label: string) => label))
    }
  }, [initialChart])

  const handleSave = () => {
    const chartData = { nodes, edges }

    onSave(chartData)
  }

  return (
    <ReactFlowProvider>
      <div className='flex h-screen'>
        <aside className='w-64 bg-gray-100 p-4 border-r'>
          <h2 className='text-lg font-semibold mb-4'>Add Shapes</h2>
          <button
            onClick={() => addNode('rectangle')}
            className='block w-full mb-2 px-4 py-2 bg-white border rounded hover:bg-blue-50'
          >
            ➕ Rectangle
          </button>
          <button
            onClick={() => addNode('circle')}
            className='block w-full mb-2 px-4 py-2 bg-white border rounded hover:bg-blue-50'
          >
            ➕ Circle
          </button>
          <button
            onClick={() => addNode('diamond')}
            className='block w-full mb-2 px-4 py-2 bg-white border rounded hover:bg-blue-50'
          >
            ➕ Diamond
          </button>
          <button
            onClick={handleSave}
            className='block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            Save Chart
          </button>
        </aside>
        <main className='flex-1'>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            selectionOnDrag
            panOnDrag
            panOnScroll
            multiSelectionKeyCode={['Shift', 'Meta']}
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </main>
      </div>
    </ReactFlowProvider>
  )
}
