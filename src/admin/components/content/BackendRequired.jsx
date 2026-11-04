// Shown on admin screens that edit real data when no API is connected.
import { Link } from "react-router";
import { ArrowLeft, PlugZap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export default function BackendRequired({ icon: Icon = PlugZap, title }) {
  return (
    <div className="mx-auto max-w-3xl py-6">
      <Card className="rounded-2xl">
        <CardContent>
          <Empty className="border-0 p-6 sm:p-10">
            <EmptyHeader className="max-w-md gap-3">
              <EmptyMedia variant="icon" className="size-14 rounded-2xl bg-primary text-primary-foreground [&_svg:not([class*='size-'])]:size-6">
                <Icon />
              </EmptyMedia>
              <EmptyTitle className="text-2xl font-semibold">{title} needs the backend</EmptyTitle>
              <EmptyDescription className="text-base">
                This screen edits what's live on the site, so it only works with the TTS API connected. Set{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-sm">VITE_API_URL</code> and reload.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/admin"><ArrowLeft /> Back to overview</Link>
              </Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    </div>
  );
}
