"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Search, MoreVertical, Ban, Trash2, Mail, Shield, Crown } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  plan: "free" | "pro" | "business"
  role: "user" | "admin"
  status: "active" | "blocked"
  links: number
  views: number
  joined: string
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    plan: "pro",
    role: "user",
    status: "active",
    links: 15,
    views: 2340,
    joined: "Jan 15, 2026",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    plan: "free",
    role: "user",
    status: "active",
    links: 5,
    views: 890,
    joined: "Jan 20, 2026",
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    plan: "business",
    role: "user",
    status: "blocked",
    links: 45,
    views: 12500,
    joined: "Dec 10, 2025",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    plan: "pro",
    role: "admin",
    status: "active",
    links: 22,
    views: 5670,
    joined: "Nov 5, 2025",
  },
  {
    id: "5",
    name: "Charlie Davis",
    email: "charlie@example.com",
    plan: "free",
    role: "user",
    status: "active",
    links: 3,
    views: 450,
    joined: "Jan 28, 2026",
  },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleBlock = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "active" ? "blocked" : "active" }
          : user
      )
    )
  }

  const deleteUser = () => {
    if (selectedUser) {
      setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id))
      setSelectedUser(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const makeAdmin = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, role: "admin" } : user
      )
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground">
          View and manage all registered users
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {users.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Pro Users</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {users.filter((u) => u.plan === "pro").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Business Users</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {users.filter((u) => u.plan === "business").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Blocked</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {users.filter((u) => u.status === "blocked").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                A list of all registered users on the platform
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Links</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-medium text-foreground">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {user.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.plan === "business"
                            ? "border-purple-500 text-purple-500"
                            : user.plan === "pro"
                              ? "border-green-500 text-green-500"
                              : "border-muted-foreground text-muted-foreground"
                        }
                      >
                        {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.role === "admin" ? (
                        <Badge className="bg-accent text-accent-foreground">
                          Admin
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">User</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === "active" ? "default" : "destructive"}
                      >
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.links}</TableCell>
                    <TableCell>{user.views.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.joined}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          {user.role !== "admin" && (
                            <DropdownMenuItem onClick={() => makeAdmin(user.id)}>
                              <Shield className="mr-2 h-4 w-4" />
                              Make Admin
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => toggleBlock(user.id)}>
                            <Ban className="mr-2 h-4 w-4" />
                            {user.status === "active" ? "Block User" : "Unblock User"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user)
                              setIsDeleteDialogOpen(true)
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.name}? This action
              cannot be undone and will permanently delete all their data.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteUser}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
