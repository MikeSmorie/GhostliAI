import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function AppCentral() {
  const [, setLocation] = useLocation();
  const [moduleNames] = useState<string[]>(
    Array.from({ length: 6 }, (_, i) => `Module ${i + 1}`)
  );

  const modules = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: moduleNames[i],
    path: `/module/${i + 1}`
  }));

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => setLocation("/subscription")}
            className="text-sm"
          >
            Manage Subscription
          </Button>
        </div>

        <div className="w-64">
          {modules.map((module) => (
            <Card 
              key={module.id}
              className="mb-2 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setLocation(`/module/${module.id}`)}
            >
              <div className="p-4">
                <span className="text-lg">{module.name}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}