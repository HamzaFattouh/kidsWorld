
import { Button } from'./Button';
import { Plus } from'lucide-react';








export function PageHeader({ title, description, actionLabel, onAction, icon: Icon }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-6 h-6 text-primary" />}
          <h2 className="text-2xl font-bold tracking-tight text-text dark:text-text-dark">{title}</h2>
        </div>
        {description &&
        <p className="text-sm text-text-muted dark:text-text-mutedDark mt-1">
            {description}
          </p>
        }
      </div>
      {actionLabel && onAction &&
      <Button onClick={onAction}>
          <Plus className="me-2 h-4 w-4" />
          {actionLabel}
        </Button>
      }
    </div>);

}