import clsx from "clsx";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Container({ children, className, ...rest }: ContainerProps) {
  return (
    <div className={clsx("container-padding mx-auto w-full max-w-6xl", className)} {...rest}>
      {children}
    </div>
  );
}


