import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z, { ZodSchema } from "zod";

export const useZodForm = (schema: ZodSchema, defaultValues?: any) => {
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return { register, watch, reset, handleSubmit, errors };
};
