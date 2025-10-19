"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Alert as AlertType } from "@/types/status";

interface StatusAlertProps {
  alert: AlertType;
}

const StatusAlert: React.FC<StatusAlertProps> = ({ alert }) => {
  const getAlertIcon = () => {
    switch (alert.type) {
      case "info":
        return <Info className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "error":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getAlertStyles = () => {
    switch (alert.type) {
      case "info":
        return "border-blue-200 bg-blue-50 text-blue-900";
      case "warning":
        return "border-yellow-200 bg-yellow-50 text-yellow-900";
      case "success":
        return "border-green-200 bg-green-50 text-green-900";
      case "error":
        return "border-red-200 bg-red-50 text-red-900";
      default:
        return "border-gray-200 bg-gray-50 text-gray-900";
    }
  };

  return (
    <Alert className={`${getAlertStyles()} relative`}>
      {getAlertIcon()}
      <AlertDescription className="flex items-center justify-between">
        <span className="flex-1">{alert.message}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-70">{alert.date}</span>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export { StatusAlert };
