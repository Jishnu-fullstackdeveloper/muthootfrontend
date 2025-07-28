'use client'

import React, { useState, useEffect, useCallback } from 'react'

import { Tree, TreeNode } from 'react-organizational-chart'
import { Box, Select, MenuItem, Button } from '@mui/material'
import { styled } from '@mui/material/styles'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchDesignation } from '@/redux/jdManagemenet/jdManagemnetSlice'

interface NodeData {
  id: string
  name: string
  parentId: string | null
  children: NodeData[]
  isJobRole?: boolean
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
  onCancel: () => void
}

export default function OrgChartCanvas({ onSave, initialChart, onCancel: handleCancel }: OrgChartCanvasProps) {
  const dispatch = useAppDispatch()
  const [limit] = useState(10)
  const [page] = useState(1)
  const { designationData } = useAppSelector(state => state.jdManagementReducer)

  // Initialize nodes, ensuring the job role node is marked
  const defaultNodes: NodeData[] = [
    {
      id: 'root',
      name: initialChart?.nodes[0]?.name || 'Root',
      parentId: null,
      children: [],
      isJobRole: true
    }
  ]

  const [nodes, setNodes] = useState<NodeData[]>(initialChart?.nodes?.length ? initialChart.nodes : defaultNodes)

  const [usedRoles, setUsedRoles] = useState<string[]>(
    initialChart?.nodes.map(node => node.name).filter(label => label) || []
  )

  useEffect(() => {
    console.log('OrgChartCanvas mounted, nodes:', JSON.stringify(nodes, null, 2))
    const params = { limit, page }

    dispatch(fetchDesignation(params))
      .unwrap()
      .catch(error => {
        console.error('Failed to fetch designations:', error)
      })
  }, [dispatch, limit, page])

  useEffect(() => {
    console.log('Nodes updated:', JSON.stringify(nodes, null, 2))
  }, [nodes])

  const roles = designationData?.length
    ? designationData.map((item: { name: string }) => item.name)
    : ['CEO', 'CTO', 'CFO', 'Manager', 'Engineer', 'HR', 'SYSTEM ADMIN', 'jr.Hr']

  const updateNode = useCallback(
    (id: string, field: 'name', value: string) => {
      setUsedRoles(prev => {
        const newUsed = [...prev]
        const prevNode = findNode(nodes, id)
        const prevLabel = prevNode?.name

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

            return { ...node, children: updateNodes(node.children) }
          })
        }

        return updateNodes(prevNodes)
      })
    },
    [nodes]
  )

  const findNode = (nodes: NodeData[], id: string): NodeData | undefined => {
    for (const node of nodes) {
      if (node.id === id) return node
      const found = findNode(node.children, id)

      if (found) return found
    }

    return undefined
  }

  const addNode = useCallback((parentId: string) => {
    const newNode: NodeData = {
      id: Date.now().toString(),
      name: '',
      children: [],
      parentId,
      isJobRole: false
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

      const updatedNodes = updateNodes(prevNodes)

      console.log('After addNode, nodes:', JSON.stringify(updatedNodes, null, 2))

      return updatedNodes
    })
  }, [])

  const addParentNode = useCallback((nodeId: string) => {
    const newParent: NodeData = {
      id: Date.now().toString(), // Unique ID
      name: 'Parent Role', // Default name
      children: [],
      parentId: null,
      isJobRole: false
    }

    setNodes(prevNodes => {
      const targetNode = findNode(prevNodes, nodeId)

      if (!targetNode) return prevNodes

      const updateNodes = (nodes: NodeData[]): NodeData[] => {
        if (!targetNode.parentId) {
          newParent.children = [{ ...targetNode, parentId: newParent.id }]

          return [newParent, ...nodes.filter(n => n.id !== nodeId)]
        }

        return nodes.map(node => {
          if (node.children.some(child => child.id === nodeId)) {
            return {
              ...node,
              children: node.children.map(child =>
                child.id === nodeId
                  ? { ...newParent, children: [{ ...child, parentId: newParent.id }], parentId: node.id }
                  : child
              )
            }
          }

          return { ...node, children: updateNodes(node.children) }
        })
      }

      const updatedNodes = updateNodes(prevNodes)

      console.log('After addParentNode, nodes:', JSON.stringify(updatedNodes, null, 2))

      return updatedNodes
    })
  }, [])

  const deleteNode = useCallback(
    (id: string) => {
      const nodeToDelete = findNode(nodes, id)

      if (!nodeToDelete) return

      if (nodes.length === 1 && nodeToDelete.id === nodes[0].id && nodeToDelete.isJobRole) {
        console.log('Attempted to delete the job role node, operation blocked')

        return
      }

      if (nodeToDelete?.name) {
        setUsedRoles(prev => prev.filter(role => role !== nodeToDelete.name))
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

        const updatedNodes = updateNodes(prevNodes)

        console.log('After deleteNode, nodes:', JSON.stringify(updatedNodes, null, 2))

        return updatedNodes
      })
    },
    [nodes]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selectedNodeId = nodes[nodes.length - 1]?.id

        if (selectedNodeId) {
          deleteNode(selectedNodeId)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nodes, deleteNode])

  const handleSave = () => {
    console.log('handleSave triggered, nodes:', JSON.stringify(nodes, null, 2))

    // Validate that all nodes have non-empty names
    const hasEmptyNames = nodes.some(node => !node.name || node.name.trim() === '')

    if (hasEmptyNames) {
      alert('All nodes must have a valid name before saving.')

      return
    }

    const topNode = nodes.find(node => !node.parentId)

    if (!topNode) {
      console.error('Topmost node not found')
      alert('Cannot save: No topmost node found')

      return
    }

    const jobRoleNode = findNode(nodes, nodes.find(n => n.isJobRole)?.id || 'root')

    if (!jobRoleNode) {
      console.error('Job role node not found')
      alert('Cannot save: Job role node not found')

      return
    }

    const chartData = { nodes }

    console.log('Saving chartData:', JSON.stringify(chartData, null, 2))

    try {
      onSave(chartData)
      console.log('onSave callback executed successfully')
    } catch (error) {
      console.error('Error in onSave callback:', error)
      alert('Failed to save chart: ' + (error.message || 'Unknown error'))
    }
  }

  const onCancel = () => {
    console.log('Cancel button clicked')
    handleCancel()
  }

  const renderNode = (node: NodeData) => (
    <TreeNode
      key={node.id}
      label={
        <StyledNode sx={{ borderColor: node.isJobRole ? '#1976d2' : '#ccc' }}>
          <Select
            value={node.name}
            onChange={e => updateNode(node.id, 'name', e.target.value)}
            size='small'
            fullWidth
            sx={{ mt: 1 }}
          >
            <MenuItem value=''>Select Role</MenuItem>
            {roles.map(designation => (
              <MenuItem
                key={designation}
                value={designation}
                disabled={usedRoles.includes(designation) && node.name !== designation}
              >
                {designation}
              </MenuItem>
            ))}
          </Select>
          <Button variant='contained' size='small' onClick={() => addNode(node.id)} sx={{ mt: 1 }}>
            Add Child
          </Button>
          <Button variant='outlined' size='small' onClick={() => addParentNode(node.id)} sx={{ mt: 1, ml: 1 }}>
            Add Parent
          </Button>
          {!(node.isJobRole && nodes.length === 1) && (
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
      <Button variant='outlined' onClick={onCancel} sx={{ mb: 2, ml: 2 }}>
        Cancel
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
