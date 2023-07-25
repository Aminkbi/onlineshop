"use client";

import { ComponentProps } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

type FormSubmitBtnProps = {
  children: React.ReactNode;
  className?: string;
} & ComponentProps<"button">;

const FormSubmitBtn = ({
  children,
  className,
  ...props
}: FormSubmitBtnProps) => {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      className={`${className} btn btn-primary`}
      type="submit"
      disabled={pending}
    >
      {pending && <span className="loading loading-infinity loading-sm"></span>}
      {children}
    </button>
  );
};

export default FormSubmitBtn;
