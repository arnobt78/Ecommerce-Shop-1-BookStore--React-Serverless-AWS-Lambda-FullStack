import { Routes, Route } from "react-router-dom";
import { HomePage, ProductsList, ProductDetail, Login, Register, CartPage, OrderPage, DashboardPage, PaymentSuccessPage, PaymentCancelPage, AdminDashboardPage, AdminProductsPage, AdminProductCreatePage, AdminProductEditPage, AdminProductDetailPage, AdminOrdersPage, AdminOrderDetailPage, AdminUsersPage, AdminUserDetailPage, AdminUserEditPage, AdminAnalyticsPage, AdminHistoryPage, AdminTicketsPage, AdminReviewsPage, CreateTicketPage, TicketsListPage, TicketDetailPage, PageNotFound } from "../pages";
import { ProtectedRoute } from "./ProtectedRoute";

export const AllRoutes = () => {
  return (
    <>
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="products" element={<ProductsList />} />
        <Route path="products/:id" element={<ProductDetail />} />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route path="cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="order-summary" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
        <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="payment-success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
        <Route path="payment-cancel" element={<ProtectedRoute><PaymentCancelPage /></ProtectedRoute>} />

        {/* Support Tickets Routes */}
        <Route path="tickets" element={<ProtectedRoute><TicketsListPage /></ProtectedRoute>} />
        <Route path="tickets/create" element={<ProtectedRoute><CreateTicketPage /></ProtectedRoute>} />
        <Route path="tickets/:ticketId" element={<ProtectedRoute><TicketDetailPage /></ProtectedRoute>} />

        {/* Admin Routes - Require admin role */}
        <Route path="admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="admin/products" element={<ProtectedRoute requiredRole="admin"><AdminProductsPage /></ProtectedRoute>} />
        <Route path="admin/products/new" element={<ProtectedRoute requiredRole="admin"><AdminProductCreatePage /></ProtectedRoute>} />
        <Route path="admin/products/:id" element={<ProtectedRoute requiredRole="admin"><AdminProductDetailPage /></ProtectedRoute>} />
        <Route path="admin/products/:id/edit" element={<ProtectedRoute requiredRole="admin"><AdminProductEditPage /></ProtectedRoute>} />
        <Route path="admin/orders" element={<ProtectedRoute requiredRole="admin"><AdminOrdersPage /></ProtectedRoute>} />
        <Route path="admin/orders/:id" element={<ProtectedRoute requiredRole="admin"><AdminOrderDetailPage /></ProtectedRoute>} />
        <Route path="admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsersPage /></ProtectedRoute>} />
        <Route path="admin/users/:id" element={<ProtectedRoute requiredRole="admin"><AdminUserDetailPage /></ProtectedRoute>} />
        <Route path="admin/users/:id/edit" element={<ProtectedRoute requiredRole="admin"><AdminUserEditPage /></ProtectedRoute>} />
        <Route path="admin/business-insights" element={<ProtectedRoute requiredRole="admin"><AdminAnalyticsPage /></ProtectedRoute>} />
        <Route path="admin/management-history" element={<ProtectedRoute requiredRole="admin"><AdminHistoryPage /></ProtectedRoute>} />
        <Route path="admin/tickets" element={<ProtectedRoute requiredRole="admin"><AdminTicketsPage /></ProtectedRoute>} />
        <Route path="admin/tickets/:ticketId" element={<ProtectedRoute requiredRole="admin"><TicketDetailPage /></ProtectedRoute>} />
        <Route path="admin/reviews" element={<ProtectedRoute requiredRole="admin"><AdminReviewsPage /></ProtectedRoute>} />

        <Route path="*" element={<PageNotFound />} />
    </Routes>
    </>
  )
}
