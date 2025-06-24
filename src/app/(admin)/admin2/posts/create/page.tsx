"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
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
import MultiSelect from "@/components/admin/MultiSelect";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { TagDropdownOption } from "@/types/schemas/tags";
import { Tag } from "@/db/schema";
import { toast } from "sonner";

const PostFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  releaseDate: z.string().optional(),
  displayImage: z.string().optional(),
  tags: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .min(1, "At least one tag is required"),
});

type FormValues = z.infer<typeof PostFormSchema>;

export default function CreatePostPage() {
  const [tagOptions, setTagOptions] = useState<TagDropdownOption[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/admin/tags");
        if (!response.ok) {
          throw new Error("Failed to fetch tags");
        }
        const data = (await response.json()) as Tag[];
        const mappedData = data.map((tag) => ({
          value: tag.id,
          label: tag.tagName,
        }));

        setTagOptions(mappedData);
      } catch (error) {
        console.error("Error fetching tags:", error);
        toast.error("Failed to fetch tags");
      } finally {
        setIsLoadingTags(false);
      }
    };

    fetchTags();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      {isLoadingTags ? (
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading tags...</span>
        </div>
      ) : (
        <CreatePostForm tagOptions={tagOptions} />
      )}
    </div>
  );
}

function CreatePostForm({ tagOptions }: { tagOptions: TagDropdownOption[] }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      releaseDate: "",
      displayImage: "",
      tags: [],
    },
  });

  const clearEditorText = () => {
    const editorElement = document.getElementById("editor-content-input");
    if (editorElement) {
      while (editorElement.firstChild) {
        editorElement.removeChild(editorElement.firstChild);
      }
    }
  };

  const clearFileInput = () => {
    const imageInput = document.getElementById("post-form-image-input");
    if (imageInput) {
      // @ts-expect-error I can't be bothered to type this
      imageInput.type = "";
      // @ts-expect-error I can't be bothered to type this
      imageInput.type = "file";
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          slug: values.slug,
          content: values.content,
          excerpt: values.excerpt,
          releaseDate: values.releaseDate,
          displayImage: values.displayImage,
          tags: values.tags.map((tag) => tag.value),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        form.reset();
        clearFileInput();
        clearEditorText();
        toast.success("Post created successfully!");
      } else {
        throw new Error(data.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create post. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          form.setValue("displayImage", base64String);
        };
        reader.readAsDataURL(file);
      }
    },
    [form],
  );

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
                  output="html"
                  placeholder="Enter your description..."
                  autofocus={true}
                  editable={true}
                  editorClassName="focus:outline-none"
                  immediatelyRender={false}
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
          name="releaseDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Release Date</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormDescription>
                Optional date when the post should be published
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="displayImage"
          render={({ field: { value, ...field } }) => (
            <FormItem>
              <FormLabel>Display Image</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-4">
                  <Input
                    id="post-form-image-input"
                    type="file"
                    accept="image/*"
                    {...field}
                    onChange={handleImageChange}
                  />
                  {value && (
                    <Image
                      src={value}
                      alt="Preview"
                      width={100}
                      height={100}
                      className="w-60 h-60 object-cover rounded-md"
                    />
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Select an image to display with your post
              </FormDescription>
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
                  options={tagOptions}
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
}
