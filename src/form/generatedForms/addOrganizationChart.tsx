'use client'

import React, { useState, useEffect, useCallback } from 'react'

import { Tree, TreeNode } from 'react-organizational-chart'
import { Box, Select, MenuItem, Button } from '@mui/material'
import { styled } from '@mui/material/styles'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchDesignation } from '@/redux/jdManagemenet/jdManagemnetSlice'

interface NodeData {
  id: string
  designation: string
  children: NodeData[]
}

const StyledNode = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  display: 'inline-block',
  minWidth: '200px',
  textAlign: 'center'
}))

interface OrgChartCanvasProps {
  onSave: (chartData: { nodes: NodeData[] }) => void
  initialChart: { nodes: NodeData[] } | null
}

export default function OrgChartCanvas({ onSave, initialChart }: OrgChartCanvasProps) {
  const dispatch = useAppDispatch()
  const [limit] = useState(10)
  const [page] = useState(1)
  const { designationData } = useAppSelector(state => state.jdManagementReducer)

  const [nodes, setNodes] = useState<NodeData[]>(
    initialChart?.nodes || [
      {
        id: '1',
        designation: '',
        children: []
      }
    ]
  )

  const [usedRoles, setUsedRoles] = useState<string[]>(
    initialChart?.nodes.map(node => node.designation).filter(label => label) || []
  )

  // Fetch designations from Redux store
  useEffect(() => {
    const params = { limit, page }

    dispatch(fetchDesignation(params))
      .unwrap()
      .catch(error => {
        console.error('Failed to fetch designations:', error)
      })
  }, [dispatch, limit, page])

  // Update roles based on fetched designationData
  const roles = designationData?.length
    ? designationData.map((item: { name: string }) => item.name)
    : ['CEO', 'CTO', 'CFO', 'Manager', 'Engineer', 'HR']

  // Update node designation and manage used roles
  const updateNode = useCallback(
    (id: string, field: 'designation', value: string) => {
      setUsedRoles(prev => {
        const newUsed = [...prev]
        const prevNode = findNode(nodes, id)
        const prevLabel = prevNode?.designation

        if (prevLabel) newUsed.splice(newUsed.indexOf(prevLabel), 1)
        if (value && !newUsed.includes(value)) newUsed.push(value)

        return newUsed
      })

      setNodes(prevNodes => {
        const updateNodes = (nodes: NodeData[]): NodeData[] => {
          return nodes.map(node => {
            if (node.id === id) {
              return { ...node, [field]: value }
            }

            // console.log('node', node)

            return { ...node, children: updateNodes(node.children) }
          })
        }

        console.log('Updating nodes', nodes)

        return updateNodes(prevNodes)
      })
    },
    [nodes]
  )

  // Find a node by ID
  const findNode = (nodes: NodeData[], id: string): NodeData | undefined => {
    for (const node of nodes) {
      if (node.id === id) return node
      const found = findNode(node.children, id)

      if (found) return found
    }

    return undefined
  }

  // Add a new node as a child of the specified parent
  const addNode = useCallback((parentId: string) => {
    const newNode: NodeData = {
      id: Date.now().toString(),
      designation: '',
      children: []
    }

    setNodes(prevNodes => {
      const updateNodes = (nodes: NodeData[]): NodeData[] => {
        return nodes.map(node => {
          if (node.id === parentId) {
            return { ...node, children: [...node.children, newNode] }
          }

          return { ...node, children: updateNodes(node.children) }
        })
      }

      return updateNodes(prevNodes)
    })
  }, [])

  // Handle node deletion
  const deleteNode = useCallback(
    (id: string) => {
      const nodeToDelete = findNode(nodes, id)

      if (nodeToDelete?.designation) {
        setUsedRoles(prev => prev.filter(role => role !== nodeToDelete.designation))
      }

      setNodes(prevNodes => {
        const updateNodes = (nodes: NodeData[]): NodeData[] => {
          return nodes
            .filter(node => node.id !== id)
            .map(node => ({
              ...node,
              children: updateNodes(node.children)
            }))
        }

        return updateNodes(prevNodes)
      })
    },
    [nodes]
  )

  // Handle keydown events for deletion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // For simplicity, assume the last clicked node is the target for deletion
        // You may need to track selected nodes in a real app
        const selectedNodeId = nodes[nodes.length - 1]?.id

        if (selectedNodeId && selectedNodeId !== '1') {
          // Prevent deleting root
          deleteNode(selectedNodeId)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nodes, deleteNode])

  // Handle saving the chart
  const handleSave = () => {
    onSave({ nodes })
    console.log('Nodes:', nodes)
  }

  // Render a single node
  const renderNode = (node: NodeData) => (
    <TreeNode
      key={node.id}
      label={
        <StyledNode>
          <Select
            value={node.designation}
            onChange={e => updateNode(node.id, 'designation', e.target.value)}
            size='small'
            fullWidth
            sx={{ mt: 1 }}
          >
            <MenuItem value=''>Select Role</MenuItem>
            {roles.map(designation => (
              <MenuItem key={designation} value={designation} disabled={usedRoles.includes(designation)}>
                {designation}
              </MenuItem>
            ))}
          </Select>
          <Button variant='contained' size='small' onClick={() => addNode(node.id)} sx={{ mt: 1 }}>
            Add Child
          </Button>
          {node.id !== '1' && (
            <Button variant='outlined' size='small' onClick={() => deleteNode(node.id)} sx={{ mt: 1, ml: 1 }}>
              Delete
            </Button>
          )}
        </StyledNode>
      }
    >
      {node.children.map(child => renderNode(child))}
    </TreeNode>
  )

  return (
    <Box sx={{ p: 4, overflow: 'auto', height: '100vh' }}>
      <Button variant='contained' onClick={handleSave} sx={{ mb: 2 }}>
        Save Chart
      </Button>
      <Tree
        lineWidth={'2px'}
        lineColor={'#1976d2'}
        lineBorderRadius={'10px'}
        label={<StyledNode>Organization Chart</StyledNode>}
      >
        {nodes.map(node => renderNode(node))}
      </Tree>
    </Box>
  )
}
