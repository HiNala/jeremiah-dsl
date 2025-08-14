import React, { ReactElement } from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export default function FormField({ label, error, children }: FormFieldProps) {
  const child = children as ReactElement<React.AriaAttributes & { id?: string }>;
  const id = child.props.id;
  const describedBy = error ? `${id}-error` : undefined;
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-foreground/80">
        {label}
      </label>
      {React.cloneElement(child, {
        "aria-invalid": !!error,
        "aria-describedby": describedBy,
      })}
      {error ? (
        <p id={describedBy} role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}


