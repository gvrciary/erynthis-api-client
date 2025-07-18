import { Folder, Zap } from "lucide-react";
import { memo } from "react";
import { useHttpStore } from "@/store/httpStore";

const WelcomeScreen = memo(() => {
  const { createRequest } = useHttpStore();

  return (
    <main className="flex-1 flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center">
            <Zap className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Erynthis API Client
          </h1>
          <p className="text-muted-foreground text-sm">
            Modern and elegant HTTP client
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <button
            type="button"
            onClick={createRequest}
            className="w-full flex items-center justify-center space-x-3 p-4 rounded-lg bg-card border border-border hover:bg-accent"
          >
            <Folder className="h-5 w-5 text-primary" />
            <span className="text-foreground font-medium">
              Create your first request
            </span>
          </button>
        </div>
      </div>
    </main>
  );
});

WelcomeScreen.displayName = "WelcomeScreen";

export default WelcomeScreen;
