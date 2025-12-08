/**
 * AdminUsersPage Component
 *
 * Users management page for admin panel.
 * Displays all users in a table with search, filters, and CRUD operations.
 * Uses React Query for efficient data fetching and caching.
 *
 * Features:
 * - Users list table with search and filters
 * - View user details
 * - Edit/Delete user functionality
 * - Real-time updates with cache invalidation
 */

import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useTitle } from "../../hooks/useTitle";
import { useAllUsers, useDeleteUser } from "../../hooks/useAdmin";
import { AdminLayout, useAdminLayout } from "../../components/Layouts/Admin";
import { formatDateShort } from "../../utils/formatDate";
import { isDemoAccount } from "../../utils/demoAccount";
import {
  SortableTable,
  PageHeader,
  SearchFilterBar,
  StatusBadge,
  LoadingState,
  ErrorState,
  EmptyState,
  Card,
  ResultsCount,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui";

// Inner component that uses the AdminLayout context
const AdminUsersContent = () => {
  const { toggleSidebar } = useAdminLayout();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: users, isLoading, error } = useAllUsers();
  const deleteUserMutation = useDeleteUser();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [filterRole, setFilterRole] = useState(
    searchParams.get("role") || "all"
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); // { id, name, email }

  // Sync search params with state
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (filterRole !== "all") params.set("role", filterRole);
    setSearchParams(params, { replace: true });
  }, [searchQuery, filterRole, setSearchParams]);

  // Show error toast if API call fails
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to load users", {
        closeButton: true,
        position: "bottom-right",
      });
    }
  }, [error]);

  // Filter users based on search query and role filter
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    let filtered = [...users];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (user) =>
          user.id?.toLowerCase().includes(query) ||
          user.name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query)
      );
    }

    // Apply role filter
    if (filterRole !== "all") {
      filtered = filtered.filter(
        (user) => (user.role || "user") === filterRole
      );
    }

    return filtered;
  }, [users, searchQuery, filterRole]);

  // Open delete confirmation dialog
  const handleDeleteClick = (userId, userName, userEmail) => {
    setUserToDelete({ id: userId, name: userName, email: userEmail });
    setDeleteDialogOpen(true);
  };

  // Handle delete user confirmation
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    // Prevent deleting demo accounts
    if (isDemoAccount(userToDelete.email)) {
      toast.error("Demo accounts cannot be deleted", {
        closeButton: true,
        position: "bottom-right",
      });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      return;
    }

    try {
      await deleteUserMutation.mutateAsync(userToDelete.id);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      // Error toast is handled by the mutation hook
      console.error("Delete error:", error);
      // Keep dialog open on error so user can try again
    }
  };

  // Define table columns configuration
  const tableColumns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      className: "",
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      className: "",
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      sortFn: (a, b) => {
        const aRole = (a.role || "user").toLowerCase();
        const bRole = (b.role || "user").toLowerCase();
        return aRole.localeCompare(bRole);
      },
      className: "",
    },
    {
      key: "createdAt",
      label: "Registered",
      sortable: true,
      sortFn: (a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateA - dateB;
      },
      className: "",
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      className: "",
    },
  ];

  // Available role filter options
  const filterRoleOptions = [
    { value: "all", label: "All Roles" },
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
  ];

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Page Header */}
      <PageHeader
        title="Users Management"
        description="Manage all users in your store"
        onToggleSidebar={toggleSidebar}
      />

      {/* Loading State */}
      {isLoading && <LoadingState message="Loading users..." />}

      {/* Error State */}
      {error && !isLoading && (
        <ErrorState message={error.message || "Failed to load users"} />
      )}

      {/* Users Table */}
      {!isLoading && !error && (
        <>
          {/* Admin Role Note */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="bi-exclamation-triangle text-amber-600 dark:text-amber-400 text-xl flex-shrink-0 mt-0.5"></span>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  Admin Role Assignment Notice
                </h3>
                <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                  Currently, you can change other users' roles from{" "}
                  <strong>User</strong> to <strong>Admin</strong> via this page.
                  However, please note that in this project, the admin account
                  is integrated with{" "}
                  <strong className="font-mono">admin@example.com</strong> via
                  environment variables in the code/account configuration.
                  Therefore, other users assigned the admin role might not have
                  full privileges to perform all real admin role activities and
                  may have limited access to certain administrative functions.
                </p>
              </div>
            </div>
          </div>

          <Card className="p-0">
            {/* Search and Filter Bar */}
            <SearchFilterBar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search by name or email..."
              filterValue={filterRole}
              onFilterChange={setFilterRole}
              filterOptions={filterRoleOptions}
            >
              <ResultsCount
                filteredCount={filteredUsers.length}
                totalCount={users?.length || 0}
                entityName="users"
              />
            </SearchFilterBar>

            {/* Users Table */}
            {filteredUsers.length === 0 ? (
              <EmptyState
                message={
                  searchQuery || filterRole !== "all"
                    ? "No users found matching your filters"
                    : "No users available"
                }
              />
            ) : (
              <SortableTable
                data={filteredUsers}
                columns={tableColumns}
                defaultSortColumn="name"
                defaultSortDirection="asc"
                renderRow={(user, index) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {user.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={user.role || "user"} />
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDateShort(user.createdAt)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {/* View Button - Always enabled */}
                        <button
                          onClick={() => navigate(`/admin/users/${user.id}`)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                          aria-label="View user details"
                        >
                          <span className="bi-eye"></span>
                        </button>
                        {/* Edit Button - Disabled for demo accounts */}
                        {(() => {
                          const demoAccount = isDemoAccount(user.email);
                          return (
                            <button
                              onClick={() =>
                                navigate(`/admin/users/${user.id}/edit`)
                              }
                              disabled={demoAccount}
                              className={`${
                                demoAccount
                                  ? "text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50"
                                  : "text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                              }`}
                              aria-label={
                                demoAccount
                                  ? "Demo accounts cannot be edited"
                                  : "Edit user"
                              }
                              title={
                                demoAccount
                                  ? "Demo accounts cannot be edited"
                                  : "Edit user"
                              }
                            >
                              <span className="bi-pencil"></span>
                            </button>
                          );
                        })()}
                        {/* Delete Button - Disabled for demo accounts */}
                        {(() => {
                          const demoAccount = isDemoAccount(user.email);
                          return (
                            <button
                              onClick={() =>
                                handleDeleteClick(
                                  user.id,
                                  user.name,
                                  user.email
                                )
                              }
                              disabled={
                                deleteUserMutation.isPending || demoAccount
                              }
                              className={`${
                                demoAccount
                                  ? "text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50"
                                  : "text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                              }`}
                              aria-label={
                                demoAccount
                                  ? "Demo accounts cannot be deleted"
                                  : "Delete user"
                              }
                              title={
                                demoAccount
                                  ? "Demo accounts cannot be deleted"
                                  : "Delete user"
                              }
                            >
                              <span className="bi-trash"></span>
                            </button>
                          );
                        })()}
                      </div>
                    </td>
                  </tr>
                )}
              />
            )}
          </Card>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              {userToDelete
                ? `Are you sure you want to delete user "${
                    userToDelete.name || userToDelete.email
                  }"? This action cannot be undone.`
                : "Are you sure you want to delete this user? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteUserMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteUserMutation.isPending}
              className="bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600"
            >
              {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const AdminUsersPage = () => {
  useTitle("Admin Users");
  const navigate = useNavigate();

  // Check if user is admin before rendering
  useEffect(() => {
    const userRole = sessionStorage.getItem("userRole");
    if (userRole !== "admin") {
      toast.error("Admin access required", {
        closeButton: true,
        position: "bottom-right",
      });
      navigate("/products");
    }
  }, [navigate]);

  return (
    <AdminLayout>
      <AdminUsersContent />
    </AdminLayout>
  );
};
