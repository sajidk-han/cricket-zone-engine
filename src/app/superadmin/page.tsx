"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { fetchOrganizations, updateOrganizationStatus } from '@/app/actions/superadmin'

export default function SuperAdminDashboard() {
  const [organizations, setOrganizations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadOrganizations()
  }, [])

  async function loadOrganizations() {
    setLoading(true)
    const { data, error } = await fetchOrganizations()
    if (error) {
      setError(error)
    } else if (data) {
      setOrganizations(data)
    }
    setLoading(false)
  }

  async function handleStatusChange(orgId: string, status: 'approved' | 'pending' | 'suspended') {
    const { error } = await updateOrganizationStatus(orgId, status)
    if (error) {
      alert("Failed to update status: " + error)
    } else {
      // Optimistic UI update
      setOrganizations(orgs => orgs.map(o => o.id === orgId ? { ...o, status } : o))
    }
  }

  if (loading) return <div className="p-8 text-center text-text-muted">Loading System Data...</div>
  if (error) return <div className="p-8 text-center text-red-500 bg-red-900/20 rounded-lg">{error}</div>

  const pendingCount = organizations.filter(o => o.status === 'pending').length
  const activeCount = organizations.filter(o => o.status === 'approved').length

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-brand-primary/20 bg-brand-primary/5">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-brand-primary uppercase tracking-wider">Pending Approvals</p>
            <p className="text-4xl font-black text-text-primary mt-2">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card className="border-bg-elevated">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-text-secondary uppercase tracking-wider">Active Organizations</p>
            <p className="text-4xl font-black text-text-primary mt-2">{activeCount}</p>
          </CardContent>
        </Card>
        <Card className="border-bg-elevated">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-text-secondary uppercase tracking-wider">Total Registered</p>
            <p className="text-4xl font-black text-text-primary mt-2">{organizations.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Organizations List */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Directory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg-elevated/50 border-y border-bg-elevated text-text-secondary">
                <tr>
                  <th className="p-4 font-medium">Organization Name</th>
                  <th className="p-4 font-medium">Slug</th>
                  <th className="p-4 font-medium">Registered Date</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-elevated">
                {organizations.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-text-muted">No organizations found.</td></tr>
                ) : organizations.map(org => (
                  <tr key={org.id} className="hover:bg-bg-surface transition-colors">
                    <td className="p-4 font-bold text-text-primary">{org.name}</td>
                    <td className="p-4 text-text-muted font-mono">{org.slug}</td>
                    <td className="p-4 text-text-secondary">{new Date(org.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      {org.status === 'approved' && <Badge variant="success">Approved</Badge>}
                      {org.status === 'pending' && <Badge variant="warning">Pending</Badge>}
                      {org.status === 'suspended' && <Badge variant="danger">Suspended</Badge>}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {org.status === 'pending' && (
                        <>
                          <Button size="sm" variant="primary" onClick={() => handleStatusChange(org.id, 'approved')}>
                            Approve
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => handleStatusChange(org.id, 'suspended')}>
                            Reject
                          </Button>
                        </>
                      )}
                      {org.status === 'approved' && (
                        <Button size="sm" variant="danger" onClick={() => handleStatusChange(org.id, 'suspended')}>
                          Suspend
                        </Button>
                      )}
                      {org.status === 'suspended' && (
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(org.id, 'approved')}>
                          Restore
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
