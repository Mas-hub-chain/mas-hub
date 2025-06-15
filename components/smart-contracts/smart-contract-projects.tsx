"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Code, CommandIcon as Deploy, Settings, Calendar, GitBranch } from "lucide-react"
import { CreateProjectDialog } from "./create-project-dialog"
import { ProjectVersions } from "./project-versions"
import { useToast } from "@/hooks/use-toast"

interface SmartContractProject {
  id: string
  project_name: string
  slug: string
  description?: string
  version?: string
  last_deployed_at?: string
  created_at: string
  updated_at: string
}

export function SmartContractProjects() {
  const [projects, setProjects] = useState<SmartContractProject[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<SmartContractProject | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/smart-contracts/projects")
      const data = await response.json()

      if (data.result) {
        setProjects(data.result)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch smart contract projects",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleProjectCreated = (newProject: SmartContractProject) => {
    setProjects((prev) => [newProject, ...prev])
    setShowCreateDialog(false)
    toast({
      title: "Success",
      description: "Smart contract project created successfully",
    })
  }

  if (selectedProject) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={() => setSelectedProject(null)} className="mb-2">
              ← Back to Projects
            </Button>
            <h2 className="text-2xl font-bold">{selectedProject.project_name}</h2>
            <p className="text-gray-600">{selectedProject.description}</p>
          </div>
        </div>
        <ProjectVersions project={selectedProject} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Smart Contract Projects</h2>
          <p className="text-gray-600">Manage your smart contract projects and versions</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Code className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Smart Contract Projects</h3>
            <p className="text-gray-600 text-center mb-4">Get started by creating your first smart contract project</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{project.project_name}</CardTitle>
                    <CardDescription className="mt-1">{project.description || "No description"}</CardDescription>
                  </div>
                  {project.version && (
                    <Badge variant="secondary" className="ml-2">
                      {project.version}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    Created {new Date(project.created_at).toLocaleDateString()}
                  </div>
                  {project.last_deployed_at && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Deploy className="mr-2 h-4 w-4" />
                      Last deployed {new Date(project.last_deployed_at).toLocaleDateString()}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedProject(project)}>
                      <GitBranch className="mr-2 h-4 w-4" />
                      View Versions
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateProjectDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  )
}
