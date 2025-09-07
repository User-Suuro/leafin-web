"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/shadcn/ui/alert";
import { Button } from "@/components/shadcn/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("Global error:", error);

  return (
    <html>
      <body className="flex h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-red-600">Critical Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <Alert variant="destructive">
              <AlertTitle>Application Failure</AlertTitle>
              <AlertDescription>
                Something went wrong and we could not recover.
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => reset()}
              variant="destructive"
              className="w-full"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </body>
    </html>
  );
}
