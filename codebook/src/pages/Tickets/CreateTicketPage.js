/**
 * Create Ticket Page
 *
 * Customer-facing page to create a new support ticket.
 * Uses reusable ShadCN UI components and React Query hooks.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../../hooks/useTitle";
import { useCreateTicket } from "../../hooks/useTickets";
import {
  Card,
  FormInput,
  FormTextarea,
  FormLabel,
  FormError,
} from "../../components/ui";

export const CreateTicketPage = () => {
  useTitle("Create Support Ticket");
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  // Mutation hook for creating ticket
  const createTicketMutation = useCreateTicket();

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /**
   * Validate form data
   * @returns {boolean} True if valid, false otherwise
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = "Subject must be at least 5 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Create ticket via mutation
    createTicketMutation.mutate(
      {
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      },
      {
        onSuccess: (data) => {
          // Navigate to ticket detail page
          navigate(`/tickets/${data.id}`);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Support Ticket
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Describe your issue and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject Field */}
            <div>
              <FormLabel htmlFor="subject" required>
                Subject
              </FormLabel>
              <FormInput
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Brief description of your issue"
                required
                disabled={createTicketMutation.isPending}
                className={errors.subject ? "border-red-500" : ""}
              />
              {errors.subject && <FormError>{errors.subject}</FormError>}
            </div>

            {/* Message Field */}
            <div>
              <FormLabel htmlFor="message" required>
                Message
              </FormLabel>
              <FormTextarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Please provide details about your issue..."
                rows={8}
                required
                disabled={createTicketMutation.isPending}
                className={errors.message ? "border-red-500" : ""}
              />
              {errors.message && <FormError>{errors.message}</FormError>}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate("/tickets")}
                disabled={createTicketMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createTicketMutation.isPending}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {createTicketMutation.isPending
                  ? "Creating..."
                  : "Create Ticket"}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
