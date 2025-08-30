import type React from "react";

interface EmptyStateProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  subtitle?: string;
}

const EmptyState = ({ icon: Icon, title, subtitle }: EmptyStateProps) => (
  <div className="flex items-center justify-center h-full text-muted-foreground">
    <div className="text-center">
      <Icon className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
      <p className="text-lg mb-2">{title}</p>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  </div>
);

export default EmptyState;
