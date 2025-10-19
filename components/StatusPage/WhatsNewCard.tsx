"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { WhatsNewItem } from "@/types/status";

interface WhatsNewCardProps {
  item: WhatsNewItem;
}

const WhatsNewCard: React.FC<WhatsNewCardProps> = ({ item }) => {
  const getTagVariant = () => {
    switch (item.tag) {
      case "Feature":
        return "default";
      case "Improvement":
        return "secondary";
      case "Bug Fix":
        return "outline";
      case "Security":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{item.title}</CardTitle>
          <Badge variant={getTagVariant()}>{item.tag}</Badge>
        </div>
        <CardDescription className="flex items-center gap-1 text-sm">
          <Calendar className="h-3 w-3" />
          {item.date}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{item.description}</p>
      </CardContent>
    </Card>
  );
};

export { WhatsNewCard };
