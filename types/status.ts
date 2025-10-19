export interface Alert {
  id: number;
  type: "info" | "warning" | "success" | "error";
  message: string;
  date: string;
  dismissible: boolean;
}

export interface WhatsNewItem {
  id: number;
  title: string;
  description: string;
  date: string;
  tag: "Feature" | "Improvement" | "Bug Fix" | "Security";
}

export interface InProgressItem {
  id: number;
  title: string;
  description: string;
  status: "Planning" | "In Development" | "Testing" | "Coming Soon";
  progress: number;
  eta: string;
}

export interface StatusData {
  alerts: Alert[];
  whatsNew: WhatsNewItem[];
  inProgress: InProgressItem[];
  lastUpdated: string;
}
