import { cn } from "@/lib/utils";

interface ContainerProps extends React.ComponentProps<"div"> {
}

export default function Container({ children, className, ...props }: ContainerProps) {
    return (
        <div {...props} className={cn('mx-auto max-w-5xl px-4', className)}>
            {children}
        </div>
    )
}