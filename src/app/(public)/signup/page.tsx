"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { changePassword } from "../../../lib/login";
import { toast } from "sonner";

const USERNAME_VALIDATION_MESSAGE =
  "username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _";
const PASSWORD_VALIDATION_MESSAGE =
  "password must be between 6 ~ 255 characters";

const SignUpSchema = z.object({
  username: z
    .string()
    .min(4, USERNAME_VALIDATION_MESSAGE)
    .max(31, USERNAME_VALIDATION_MESSAGE),
  password: z
    .string()
    .min(6, PASSWORD_VALIDATION_MESSAGE)
    .max(255, PASSWORD_VALIDATION_MESSAGE),
});

type FormValues = z.infer<typeof SignUpSchema>;

const Page = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  return (
    <Form {...form}>
      <form
        action={async (formData) => {
          const response = await changePassword(formData);
          if (response.error) {
            console.error(response.error);
            toast.error("FAILED TO SIGNUP");
          }
        }}
        className="space-y-6"
        title=""
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-pure-white">Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-pure-white">Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="text-pure-white" type="submit">
          Sign Up
        </Button>
      </form>
    </Form>
  );
};

export default Page;
