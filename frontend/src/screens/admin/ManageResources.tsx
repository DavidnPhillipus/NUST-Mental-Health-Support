import { useEffect, useState } from 'react'
import type { ScreenContext } from '../index'
import type { Resource } from '../../types'
import styles from '../../styles/Content.module.css'

export default function ManageResources({ context }: { context: ScreenContext }) {
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: 'article' as 'article' | 'video' | 'tool',
    category: 'general',
    approvalStatus: 'pending' as 'pending' | 'approved',
    url: '',
  })
  const [draftResources, setDraftResources] = useState<Resource[]>(context.resources)

  useEffect(() => {
    setDraftResources(context.resources.map(resource => ({ ...resource })))
  }, [context.resources])

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    window.setTimeout(() => setToast(null), 2500)
  }

  const handleAdd = async () => {
    if (newResource.title && newResource.description) {
      try {
        await context.onAddResource(newResource)
        setNewResource({
          title: '',
          description: '',
          type: 'article',
          category: 'general',
          approvalStatus: 'pending',
          url: '' ,
        })
        showToast('success', 'Resource added.')
      } catch (error) {
        showToast('error', (error as Error).message)
      }
    }
  }

  const updateDraft = (resourceId: string, updates: Partial<Resource>) => {
    setDraftResources(prev => prev.map(resource => resource.id === resourceId ? { ...resource, ...updates } : resource))
  }

  const handleSave = async (resourceId: string) => {
    const resource = draftResources.find(entry => entry.id === resourceId)
    if (!resource) return

    try {
      await context.onUpdateResource(resource)
      showToast('success', `${resource.title} saved.`)
    } catch (error) {
      showToast('error', (error as Error).message)
    }
  }

  const handleApprove = async (resourceId: string) => {
    const resource = draftResources.find(entry => entry.id === resourceId)
    if (!resource) return

    try {
      const approved = { ...resource, approvalStatus: 'approved' as const }
      setDraftResources(prev => prev.map(entry => entry.id === resourceId ? approved : entry))
      await context.onUpdateResource(approved)
      showToast('success', `${resource.title} approved.`)
    } catch (error) {
      showToast('error', (error as Error).message)
    }
  }

  const handleDelete = async (resourceId: string, resourceTitle: string) => {
    const confirmed = window.confirm(`Delete ${resourceTitle}? This action cannot be undone.`)
    if (!confirmed) return

    try {
      await context.onDeleteResource(resourceId)
      showToast('success', `${resourceTitle} removed.`)
    } catch (error) {
      showToast('error', (error as Error).message)
    }
  }

  return (
    <div className={styles.card}>
      {toast && (
        <div
          style={{
            marginBottom: '1rem',
            padding: '0.8rem 1rem',
            borderRadius: '0.75rem',
            border: `1px solid ${toast.type === 'success' ? '#86efac' : '#fca5a5'}`,
            background: toast.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: toast.type === 'success' ? '#166534' : '#991b1b',
            fontWeight: 600,
          }}
        >
          {toast.message}
        </div>
      )}

      <div className={styles.cardHeading}>Manage Resources</div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Title</label>
        <input className={styles.formInput} value={newResource.title} onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))} />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Description</label>
        <textarea className={styles.formTextarea} value={newResource.description} onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))} />
      </div>
      <div className={styles.grid2}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Category</label>
          <input className={styles.formInput} value={newResource.category} onChange={(e) => setNewResource(prev => ({ ...prev, category: e.target.value }))} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Type</label>
          <select className={styles.formSelect} value={newResource.type} onChange={(e) => setNewResource(prev => ({ ...prev, type: e.target.value as any }))}>
            <option value="article">Article</option>
            <option value="video">Video</option>
            <option value="tool">Tool</option>
          </select>
        </div>
      </div>
      <div className={styles.grid2}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Approval Status</label>
          <select className={styles.formSelect} value={newResource.approvalStatus} onChange={(e) => setNewResource(prev => ({ ...prev, approvalStatus: e.target.value as 'pending' | 'approved' }))}>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>URL (optional)</label>
          <input className={styles.formInput} value={newResource.url} onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))} />
        </div>
      </div>
      <button type="button" className={styles.button} onClick={handleAdd}>
        Add Resource
      </button>

      <div className={styles.cardHeading} style={{ marginTop: '2rem' }}>Existing Resources</div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Type</th>
              <th>Status</th>
              <th>URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {draftResources.map(resource => (
              <tr key={resource.id}>
                <td>
                  <input
                    className={styles.formInput}
                    style={{ margin: 0, padding: '0.7rem 0.9rem' }}
                    value={resource.title}
                    onChange={(event) => updateDraft(resource.id, { title: event.target.value })}
                  />
                  <textarea
                    className={styles.formTextarea}
                    style={{ marginTop: '0.75rem', minHeight: '84px', padding: '0.8rem 0.9rem' }}
                    value={resource.description}
                    onChange={(event) => updateDraft(resource.id, { description: event.target.value })}
                  />
                </td>
                <td>
                  <input
                    className={styles.formInput}
                    style={{ margin: 0, padding: '0.7rem 0.9rem' }}
                    value={resource.category}
                    onChange={(event) => updateDraft(resource.id, { category: event.target.value })}
                  />
                </td>
                <td>
                  <select
                    className={styles.formSelect}
                    style={{ margin: 0, padding: '0.7rem 0.9rem' }}
                    value={resource.type}
                    onChange={(event) => updateDraft(resource.id, { type: event.target.value as Resource['type'] })}
                  >
                    <option value="article">Article</option>
                    <option value="video">Video</option>
                    <option value="tool">Tool</option>
                  </select>
                </td>
                <td>
                  <select
                    className={styles.formSelect}
                    style={{ margin: 0, padding: '0.7rem 0.9rem' }}
                    value={resource.approvalStatus}
                    onChange={(event) => updateDraft(resource.id, { approvalStatus: event.target.value as Resource['approvalStatus'] })}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                  </select>
                </td>
                <td>
                  <input
                    className={styles.formInput}
                    style={{ margin: 0, padding: '0.7rem 0.9rem' }}
                    value={resource.url ?? ''}
                    onChange={(event) => updateDraft(resource.id, { url: event.target.value })}
                  />
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button type="button" className={styles.buttonSecondary} style={{ marginTop: 0, padding: '0.5rem 0.85rem' }} onClick={() => void handleSave(resource.id)}>
                      Save
                    </button>
                    <button type="button" className={styles.buttonSecondary} style={{ marginTop: 0, padding: '0.5rem 0.85rem' }} onClick={() => void handleApprove(resource.id)}>
                      Approve
                    </button>
                    <button type="button" className={styles.buttonSecondary} style={{ marginTop: 0, padding: '0.5rem 0.85rem', borderColor: '#ef4444', color: '#b91c1c' }} onClick={() => void handleDelete(resource.id, resource.title)}>
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
