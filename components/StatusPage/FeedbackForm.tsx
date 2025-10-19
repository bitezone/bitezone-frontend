"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import { CheckCircle, Send } from "lucide-react";

interface FormData {
  feedback_type: string;
  priority: string;
  subject: string;
  description: string;
  user_name: string;
  user_email: string;
}

interface FormErrors {
  feedback_type?: string;
  priority?: string;
  subject?: string;
  description?: string;
  user_email?: string;
}

const FeedbackForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    feedback_type: "",
    priority: "",
    subject: "",
    description: "",
    user_name: "",
    user_email: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Real-time validation
  const validateField = (
    name: keyof FormData,
    value: string
  ): string | undefined => {
    switch (name) {
      case "feedback_type":
        return !value ? "Please select a feedback type" : undefined;
      case "priority":
        return !value ? "Please select a priority level" : undefined;
      case "subject":
        if (!value) return "Subject is required";
        if (value.length < 5) return "Subject must be at least 5 characters";
        return undefined;
      case "description":
        if (!value) return "Description is required";
        if (value.length < 20)
          return "Description must be at least 20 characters";
        return undefined;
      case "user_email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Please enter a valid email address";
        }
        return undefined;
      default:
        return undefined;
    }
  };

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const isFormValid = () => {
    return (
      formData.feedback_type &&
      formData.priority &&
      formData.subject.length >= 5 &&
      formData.description.length >= 20 &&
      (!formData.user_email ||
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsSubmitting(true);

    try {
      // Initialize EmailJS
      emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!);

      // Prepare template parameters
      const templateParams = {
        title: formData.subject,
        name: formData.user_name || "Anonymous",
        time: new Date().toLocaleString(),
        message: `
Type: ${formData.feedback_type}
Priority: ${formData.priority}

Description:
${formData.description}

Contact: ${formData.user_email || "Not provided"}
        `.trim(),
        email: formData.user_email || "Not provided",
      };

      // Send email
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams
      );

      setIsSubmitted(true);
      // Reset form after animation
      setTimeout(() => {
        setFormData({
          feedback_type: "",
          priority: "",
          subject: "",
          description: "",
          user_name: "",
          user_email: "",
        });
        setErrors({});
        setIsSubmitted(false);
      }, 3000); // Show animation for 3 seconds
    } catch (error) {
      console.error("Error sending feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success animation component
  if (isSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="py-16">
          <div className="text-center space-y-6">
            {/* Animated checkmark */}
            <div className="relative">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="w-12 h-12 text-green-600 animate-bounce" />
              </div>
              {/* Ripple effect */}
              <div className="absolute inset-0 mx-auto w-20 h-20 bg-green-200 rounded-full animate-ping opacity-20"></div>
            </div>

            {/* Success message */}
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-green-600">
                Feedback Submitted!
              </h3>
              <p className="text-gray-600">
                Thank you for your feedback. We will review it and get back to
                you soon.
              </p>
            </div>

            {/* Loading dots */}
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Send Us Feedback
        </CardTitle>
        <CardDescription>
          Help us improve BiteZone by sharing your thoughts, reporting issues,
          or suggesting new features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Name */}
          <div className="space-y-2">
            <label
              htmlFor="user_name"
              className="text-sm font-medium text-gray-700"
            >
              Your Name (Optional)
            </label>
            <Input
              id="user_name"
              type="text"
              placeholder="Enter your name"
              value={formData.user_name}
              onChange={(e) => handleInputChange("user_name", e.target.value)}
            />
          </div>

          {/* User Email */}
          <div className="space-y-2">
            <label
              htmlFor="user_email"
              className="text-sm font-medium text-gray-700"
            >
              Your Email (Optional)
            </label>
            <Input
              id="user_email"
              type="email"
              placeholder="Enter your email for follow-up"
              value={formData.user_email}
              onChange={(e) => handleInputChange("user_email", e.target.value)}
              className={errors.user_email ? "border-red-500" : ""}
            />
            {errors.user_email && (
              <p className="text-sm text-red-600">{errors.user_email}</p>
            )}
          </div>
          {/* Feedback Type */}
          <div className="space-y-2">
            <label
              htmlFor="feedback_type"
              className="text-sm font-medium text-gray-700"
            >
              Feedback Type *
            </label>
            <Select
              value={formData.feedback_type}
              onValueChange={(value) =>
                handleInputChange("feedback_type", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select feedback type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bug Report">Bug Report</SelectItem>
                <SelectItem value="Feature Request">Feature Request</SelectItem>
                <SelectItem value="General Feedback">
                  General Feedback
                </SelectItem>
                <SelectItem value="Performance Issue">
                  Performance Issue
                </SelectItem>
                <SelectItem value="UI/UX Suggestion">
                  UI/UX Suggestion
                </SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.feedback_type && (
              <p className="text-sm text-red-600">{errors.feedback_type}</p>
            )}
          </div>

          {/* Priority Level */}
          <div className="space-y-2">
            <label
              htmlFor="priority"
              className="text-sm font-medium text-gray-700"
            >
              Priority Level *
            </label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleInputChange("priority", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            {errors.priority && (
              <p className="text-sm text-red-600">{errors.priority}</p>
            )}
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label
              htmlFor="subject"
              className="text-sm font-medium text-gray-700"
            >
              Subject *
            </label>
            <Input
              id="subject"
              type="text"
              placeholder="Brief description of your feedback"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              className={errors.subject ? "border-red-500" : ""}
            />
            {errors.subject && (
              <p className="text-sm text-red-600">{errors.subject}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description *
            </label>
            <textarea
              id="description"
              placeholder="Please provide detailed information about your feedback..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[100px] ${
                errors.description ? "border-red-500" : ""
              }`}
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Send className="w-4 h-4" />
                <span>Submit Feedback</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export { FeedbackForm };
