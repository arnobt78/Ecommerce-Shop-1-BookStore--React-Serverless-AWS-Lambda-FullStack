/**
 * Admin Tickets Page
 *
 * Admin-facing page to manage all support tickets.
 * Displays all tickets in a table with search, filters, and status management.
 * Uses reusable ShadCN UI components and React Query hooks.
 */

import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTitle } from "../../hooks/useTitle";
import { useTickets, useUpdateTicketStatus } from "../../hooks/useTickets";
import { AdminLayout, useAdminLayout } from "../../components/Layouts/Admin";
import { formatDateLong } from "../../utils/formatDate";
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
} from "../../components/ui";

// Inner component that uses the AdminLayout context
const AdminTicketsContent = () => {
  const { toggleSidebar } = useAdminLayout();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [filterStatus, setFilterStatus] = useState(
    searchParams.get("status") || "all"
  );

  // Fetch tickets (admin gets all tickets)
  const { data: tickets = [], isLoading, error, refetch } = useTickets();
  const updateStatusMutation = useUpdateTicketStatus();

  // Sync search params with state
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (filterStatus !== "all") params.set("status", filterStatus);
    setSearchParams(params, { replace: true });
  }, [searchQuery, filterStatus, setSearchParams]);

  // Show error toast if API call fails
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to load tickets", {
        closeButton: true,
        position: "bottom-right",
      });
    }
  }, [error]);

  // Filter and search tickets
  const filteredTickets = useMemo(() => {
    let filtered = [...tickets];

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === filterStatus);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ticket) =>
          ticket.subject?.toLowerCase().includes(query) ||
          ticket.customerEmail?.toLowerCase().includes(query) ||
          ticket.customerName?.toLowerCase().includes(query) ||
          ticket.messages?.[0]?.message?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tickets, filterStatus, searchQuery]);

  // Get status badge color
  const getStatusColor = useCallback((status) => {
    const colorMap = {
      open: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      in_progress:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      resolved:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      closed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };
    return (
      colorMap[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    );
  }, []);

  // Handle status update
  const handleStatusUpdate = useCallback(
    (ticketId, newStatus) => {
      updateStatusMutation.mutate(
        { ticketId, status: newStatus },
        {
          onSuccess: () => {
            // Don't need to refetch - React Query will invalidate and refetch automatically
          },
        }
      );
    },
    [updateStatusMutation]
  );

  // Define table columns
  const tableColumns = useMemo(
    () => [
      {
        key: "createdAt",
        label: "Created",
        sortable: true,
        className: "min-w-[140px]",
      },
      {
        key: "subject",
        label: "Subject",
        sortable: true,
        className: "min-w-[200px]",
      },
      {
        key: "customer",
        label: "Customer",
        sortable: true,
        sortFn: (a, b) => {
          const nameA = (a.customerName || a.customerEmail || "").toLowerCase();
          const nameB = (b.customerName || b.customerEmail || "").toLowerCase();
          return nameA.localeCompare(nameB);
        },
        className: "min-w-[150px]",
      },
      {
        key: "status",
        label: "Status",
        sortable: true,
        className: "min-w-[80px]",
      },
      {
        key: "messages",
        label: "Messages",
        sortable: true,
        sortFn: (a, b) => (a.messages?.length || 0) - (b.messages?.length || 0),
        className: "min-w-[60px]",
      },
      {
        key: "updatedAt",
        label: "Last Updated",
        sortable: true,
        className: "min-w-[140px]",
      },
    ],
    []
  );

  // Helper function to format date in two lines (date on first line, time on second)
  const formatDateTwoLines = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const datePart = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const timePart = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return { datePart, timePart };
    } catch {
      return { datePart: "N/A", timePart: "" };
    }
  }, []);

  // Render table row
  const renderRow = useCallback(
    (ticket) => {
      const createdDate = formatDateTwoLines(ticket.createdAt);
      const updatedDate = formatDateTwoLines(ticket.updatedAt);

      return (
        <tr
          key={ticket.id}
          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
        >
          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
            {ticket.createdAt ? (
              <div>
                <div className="text-sm">{createdDate.datePart}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  at {createdDate.timePart}
                </div>
              </div>
            ) : (
              "N/A"
            )}
          </td>
          <td className="px-4 sm:px-6 py-4">
            <div className="text-sm text-gray-900 dark:text-white">
              {ticket.subject}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
              {ticket.messages?.[0]?.message || "No message"}
            </div>
          </td>
          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
            <div className="text-sm">
              <div className="text-sm text-gray-900 dark:text-white">
                {ticket.customerName || "Customer"}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {ticket.customerEmail}
              </div>
            </div>
          </td>
          <td
            className="px-4 sm:px-6 py-4 whitespace-nowrap"
            onClick={(e) => e.stopPropagation()} // Prevent row click when clicking status dropdown
          >
            <StatusBadge
              status={ticket.status}
              className={getStatusColor(ticket.status)}
              asSelect={true}
              onChange={(newStatus) => {
                handleStatusUpdate(ticket.id, newStatus);
              }}
              options={[
                { value: "open", label: "Open" },
                { value: "in_progress", label: "In Progress" },
                { value: "resolved", label: "Resolved" },
                { value: "closed", label: "Closed" },
              ]}
              customLabels={{
                open: "Open",
                in_progress: "In Progress",
                resolved: "Resolved",
                closed: "Closed",
              }}
            />
          </td>
          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
            {ticket.messages?.length || 0}
          </td>
          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
            {ticket.updatedAt ? (
              <div>
                <div className="text-sm">{updatedDate.datePart}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  at {updatedDate.timePart}
                </div>
              </div>
            ) : (
              "N/A"
            )}
          </td>
        </tr>
      );
    },
    [navigate, getStatusColor, handleStatusUpdate, formatDateTwoLines]
  );

  // Status filter options
  const filterStatusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader
        title="Support Tickets"
        description="Manage all customer support tickets"
        onToggleSidebar={toggleSidebar}
      />

      <div className="max-w-7xl mx-auto py-6">
        {/* Loading State */}
        {isLoading && <LoadingState message="Loading tickets..." />}

        {/* Error State */}
        {error && !isLoading && (
          <ErrorState
            message={error.message || "Failed to load tickets"}
            onRetry={refetch}
          />
        )}

        {/* Tickets Table */}
        {!isLoading && !error && (
          <Card className="p-0">
            {/* Search and Filter Bar */}
            <SearchFilterBar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search by subject, customer name, or email..."
              filterValue={filterStatus}
              onFilterChange={setFilterStatus}
              filterOptions={filterStatusOptions}
            >
              <ResultsCount
                filteredCount={filteredTickets.length}
                totalCount={tickets.length}
                entityName="tickets"
              />
            </SearchFilterBar>

            {/* Table */}
            {filteredTickets.length === 0 ? (
              <EmptyState
                message={
                  searchQuery || filterStatus !== "all"
                    ? "No tickets found matching your filters"
                    : "No tickets available"
                }
              />
            ) : (
              <SortableTable
                columns={tableColumns}
                data={filteredTickets}
                renderRow={renderRow}
                defaultSortColumn="createdAt"
                defaultSortDirection="desc"
              />
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

// Export component wrapped with AdminLayout
export const AdminTicketsPage = () => {
  useTitle("Support Tickets - Admin");
  return (
    <AdminLayout>
      <AdminTicketsContent />
    </AdminLayout>
  );
};
