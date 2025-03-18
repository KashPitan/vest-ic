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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MultiSelect from "./MultiSelect";
import { MinimalTiptapEditor } from "../minimal-tiptap";
// import { Content } from "@tiptap/react";
// import { TagsSchema } from "@/schemas/tags";

// TODO: this?: https://oleksii-s.dev/blog/how-to-build-inline-rich-text-field-in-payload-cms

// Define the form schema with validation
export const CreatePostFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z
    .object({
      root: z
        .object({
          type: z.string(),
          children: z.array(
            z
              .object({
                type: z.string(),
                version: z.number(),
              })
              .passthrough()
          ),
          direction: z.union([z.literal("ltr"), z.literal("rtl"), z.null()]),
          format: z.union([
            z.literal("left"),
            z.literal("start"),
            z.literal("center"),
            z.literal("right"),
            z.literal("end"),
            z.literal("justify"),
            z.literal(""),
          ]),
          indent: z.number(),
          version: z.number(),
        })
        .passthrough(),
    })
    .passthrough(),
  excerpt: z.string().min(1, "Excerpt is required"),
  tags: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .min(1, "At least one tag is required"),
});

type FormValues = z.infer<typeof CreatePostFormSchema>;

const CreatePostForm = () => {
  const [tags, setTags] = useState<{ value: string; label: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [value, setValue] = useState<Content>("");

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(CreatePostFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: undefined,
      excerpt: "",
      tags: [],
    },
  });

  // Fetch tags from PayloadCMS
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags");
        const data = await response.json();
        // TODO: parse tags
        // const tagsData = TagsSchema.parse(data.docs);

        if (data.docs) {
          setTags(
            data.docs.map((tag: { id: number; tag_name: string }) => ({
              value: tag.id,
              label: tag.tag_name,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    console.log(form.getValues("content"));
  }, [form.getValues("content")]);

  useEffect(() => {
    console.log(form.getValues("tags"));
  }, [form.getValues("tags")]);

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      // Create post in PayloadCMS
      console.log({
        title: values.title,
        slug: values.slug,
        content: values.content,
        excerpt: values.excerpt,
        tags: values.tags.map((tag) => tag.value),
      });
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          slug: values.slug,
          content: values.content,
          excerpt: values.excerpt,
          tags: values.tags.map((tag) => tag.value),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Reset form on success
        form.reset();
        alert("Post created successfully!");
      } else {
        throw new Error(data.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Post title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="post-slug" {...field} />
              </FormControl>
              <FormDescription>
                URL-friendly version of the title
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <MinimalTiptapEditor
                  value={field.value}
                  onChange={field.onChange}
                  className="w-full"
                  editorContentClassName="p-5"
                  output="json"
                  placeholder="Enter your description..."
                  autofocus={true}
                  editable={true}
                  editorClassName="focus:outline-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief summary of your post..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <MultiSelect
                  selected={field.value}
                  options={tags}
                  onChange={field.onChange}
                  placeholder="Select tags"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Post...
            </>
          ) : (
            "Create Post"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CreatePostForm;

// type RichTextValue = {
//   root: {
//     type: string;
//     children: {
//       type: string;
//       version: number;
//       [k: string]: unknown;
//     }[];
//     direction: ("ltr" | "rtl") | null;
//     format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
//     indent: number;
//     version: number;
//   };
//   [k: string]: unknown;
// };
