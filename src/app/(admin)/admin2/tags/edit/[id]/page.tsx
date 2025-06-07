"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
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
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

const formSchema = z.object({
  tagName: z
    .string()
    .min(2, "Tag name must be at least 2 characters")
    .max(50, "Tag name must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9\s-]+$/,
      "Tag name can only contain letters, numbers, spaces, and hyphens",
    ),
});

type FormValues = z.infer<typeof formSchema>;

type TagFormData = {
  id: string;
  tagName: string;
};

export default function EditTagPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [_, setTagData] = useState<TagFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tagName: "",
    },
  });

  useEffect(() => {
    async function fetchTag() {
      try {
        const response = await fetch(`/api/admin/tags/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch tag");
        }
        const data = await response.json();
        setTagData(data);
        form.reset({ tagName: data.tagName });
      } catch (error) {
        console.error("Error fetching tag:", error);
        toast.error("Failed to fetch tag data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTag();
  }, [id, form]);

  async function onSubmit(values: FormValues) {
    try {
      const response = await fetch(`/api/admin/tags/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success("Tag updated successfully");
      router.push("/admin2/tags");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading tag data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Tag</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="tagName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tag Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter tag name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update Tag</Button>
        </form>
      </Form>
    </div>
  );
}
