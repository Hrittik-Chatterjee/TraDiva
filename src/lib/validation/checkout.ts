import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  line1: z.string().min(5, "Address must be at least 5 characters"),
  line2: z.string().optional().or(z.literal("")),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postalCode: z.string().min(4, "Postal code must be at least 4 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  phone: z.string().min(6, "Phone must be at least 6 characters"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
