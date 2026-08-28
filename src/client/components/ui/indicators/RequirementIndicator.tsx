import { CheckIcon, CircleIcon } from 'lucide-react';

interface RequirementIndicatorProps {
    label: string;
    valid: boolean;
}

export default function RequirementIndicator({
    label,
    valid,
}: RequirementIndicatorProps) {
    return (
        <div
            className={`flex items-center gap-2 text-xs ${
                valid ? 'text-green-500' : 'text-foreground/40'
            }`}
        >
            {valid ? (
                <CheckIcon className="h-3.5 w-3.5" />
            ) : (
                <CircleIcon className="h-3.5 w-3.5" />
            )}

            <span>{label}</span>
        </div>
    );
}
