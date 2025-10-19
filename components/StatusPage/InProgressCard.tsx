"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock } from "lucide-react";
import { InProgressItem } from "@/types/status";

interface InProgressCardProps {
  item: InProgressItem;
}

const InProgressCard: React.FC<InProgressCardProps> = ({ item }) => {
  const getStatusColor = () => {
    switch (item.status) {
      case "Planning":
        return "bg-gray-500";
      case "In Development":
        return "bg-blue-500";
      case "Testing":
        return "bg-yellow-500";
      case "Coming Soon":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{item.title}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
            {item.status}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1 text-sm">
          <Clock className="h-3 w-3" />
          ETA: {item.eta}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{item.progress}%</span>
          </div>
          <Progress value={item.progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export { InProgressCard };
