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
  nodes?: NodeData[]
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

  const [nodes, setNodes] = useState<NodeData[]>(
    initialChart?.nodes || [
      {
        id: '1',
        name: '',
        parentId: null,
        children: []
      }
    ]
  )

  const [usedRoles, setUsedRoles] = useState<string[]>(
    initialChart?.nodes.map(node => node.name).filter(label => label) || []
  )

  useEffect(() => {
    const params = { limit, page }

    dispatch(fetchDesignation(params))
      .unwrap()
      .catch(error => {
        console.error('Failed to fetch designations:', error)
      })
  }, [dispatch, limit, page])

  const roles = designationData?.length
    ? designationData.map((item: { name: string }) => item.name)
    : ['CEO', 'CTO', 'CFO', 'Manager', 'Engineer', 'HR']

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
      parentId: parentId
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

  const addParentNode = useCallback(
    (nodeId: string) => {
      const newParent: NodeData = {
        id: Date.now().toString(),
        name: '',
        children: [],
        parentId: null
      }

      setNodes(prevNodes => {
        const updateNodes = (nodes: NodeData[]): NodeData[] => {
          return nodes.map(node => {
            if (node.id === nodeId) {
              newParent.children = [node]
              newParent.parentId = node.parentId
              node.parentId = newParent.id

              return newParent
            }

            if (node.children.some(child => child.id === nodeId)) {
              return {
                ...node,
                children: node.children.map(child =>
                  child.id === nodeId ? { ...newParent, children: [child], parentId: node.id } : child
                )
              }
            }

            return { ...node, children: updateNodes(node.children) }
          })
        }

        const updatedNodes = updateNodes(prevNodes)

        if (prevNodes.some(n => n.id === nodeId)) {
          return [newParent, ...prevNodes.filter(n => n.id !== nodeId)]
        }

        return updatedNodes
      })
    },
    [nodes]
  )

  const deleteNode = useCallback(
    (id: string) => {
      const nodeToDelete = findNode(nodes, id)

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

        return updateNodes(prevNodes)
      })
    },
    [nodes]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selectedNodeId = nodes[nodes.length - 1]?.id

        if (selectedNodeId && selectedNodeId !== '1') {
          deleteNode(selectedNodeId)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nodes, deleteNode])

  const handleSave = () => {
    onSave({ nodes })
    console.log('Nodes:', nodes)
  }

  const onCancel = () => {
    handleCancel()
  }

  const renderNode = (node: NodeData) => (
    <TreeNode
      key={node.id}
      label={
        <StyledNode>
          <Select
            value={node.name}
            onChange={e => updateNode(node.id, 'name', e.target.value)}
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
          <Button variant='outlined' size='small' onClick={() => addParentNode(node.id)} sx={{ mt: 1, ml: 1 }}>
            Add Parent
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
