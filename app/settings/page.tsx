"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InProgressCard } from "@/components/StatusPage/InProgressCard";
import { WhatsNewCard } from "@/components/StatusPage/WhatsNewCard";
import { StatusAlert } from "@/components/StatusPage/StatusAlert";
import { FeedbackForm } from "@/components/StatusPage/FeedbackForm";
import { StatusData } from "@/types/status";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useEffect, useState } from "react";

const Settings = () => {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        setLoading(true);
        // Fetch from GitHub Gist raw URLhttps://gist.github.com/sonephyo/085a6c0ec8e7c135bf22dd806f7910a5
        const response = await fetch(
          "https://gist.githubusercontent.com/sonephyo/085a6c0ec8e7c135bf22dd806f7910a5/raw/bitezone_updates.json"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch status data");
        }

        const statusData = await response.json();
        setData(statusData);
        setError(null);
      } catch (err) {
        console.error("Error fetching status data:", err);
        setError("Failed to load status updates. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatusData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-6 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">
            Manage your preferences and stay updated with BiteZone
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600">Loading status updates...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen p-6 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">
            Manage your preferences and stay updated with BiteZone
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">
                Unable to Load Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                {error || "Failed to load status updates."}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Try Again
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const lastUpdated = format(
    new Date(data.lastUpdated),
    "MMM dd, yyyy 'at' h:mm a"
  );

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">
          Manage your preferences and stay updated with BiteZone
        </p>
      </div>

      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="status">Status & Updates</TabsTrigger>
          <TabsTrigger value="feedback">Send Feedback</TabsTrigger>
        </TabsList>

        {/* Status & Updates Tab */}
        <TabsContent value="status" className="space-y-8 mt-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Status & Updates
            </h2>
            <p className="text-gray-600">
              Stay informed about what&#39;s happening with BiteZone
            </p>
            <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
          </div>

          {/* Alerts Section */}
          <section className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-900">
              Important Alerts
            </h3>
            <div className="space-y-3">
              {data.alerts.map((alert) => (
                <StatusAlert key={alert.id} alert={alert} />
              ))}
            </div>
          </section>

          {/* What's New Section */}
          <section className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-900">
              What&#39;s New
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.whatsNew.map((item) => (
                <WhatsNewCard key={item.id} item={item} />
              ))}
            </div>
          </section>

          <Separator />

          {/* In Progress Section */}
          <section className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-900">
              In Progress
            </h3>
            <p className="text-gray-600">
              Features and improvements we&#39;re currently working on
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.inProgress.map((item) => (
                <InProgressCard key={item.id} item={item} />
              ))}
            </div>
          </section>

          {/* Footer Info */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">Stay Updated</CardTitle>
              <CardDescription>
                We regularly update this page with new features, improvements,
                and important announcements. Check back often to see what&#39;s
                new!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Have feedback or suggestions? We&#39;d love to hear from you!
                Your input helps us make BiteZone better for everyone.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Send Feedback Tab */}
        <TabsContent value="feedback" className="mt-6">
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Send Us Feedback
            </h2>
            <p className="text-gray-600">
              We value your input! Help us improve BiteZone by sharing your
              thoughts.
            </p>
          </div>
          <FeedbackForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
