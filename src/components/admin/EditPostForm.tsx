"use client";
import { useState, useCallback } from "react";
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
import { TagDropdownOption } from "@/schemas/tagsSchema";
import { format } from "date-fns";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";

const PostFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  releaseDate: z.string().optional(),
  displayImage: z.string().optional(),
  tags: z
    .array(z.object({ value: z.number(), label: z.string() }))
    .min(1, "At least one tag is required"),
  isHighlight: z.boolean().optional(),
});

type FormValues = z.infer<typeof PostFormSchema>;

type PostFormData = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  releaseDate?: string;
  displayImage?: string;
  displayImageUrl?: string;
  tags?: { value: number; label: string }[];
  id: string;
};

type HighLightOptions = {
  isHighlight: boolean;
  canHighlight: boolean;
};

function getDirtyValues<
  DirtyFields extends Record<string, unknown>,
  Values extends Partial<Record<keyof DirtyFields, unknown>>,
>(dirtyFields: DirtyFields, values: Values): Partial<typeof values> {
  const dirtyValues = Object.keys(dirtyFields).reduce((prev, key) => {
    if (!dirtyFields[key]) return prev;

    return {
      ...prev,
      [key]:
        typeof dirtyFields[key] === "object"
          ? getDirtyValues(
              dirtyFields[key] as DirtyFields,
              values[key] as Values,
            )
          : values[key],
    };
  }, {});

  return dirtyValues;
}

export const EditPostForm = ({
  post,
  tagOptions,
  highLightOptions,
}: {
  post: PostFormData;
  tagOptions: TagDropdownOption[];
  highLightOptions: HighLightOptions;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const highlightsMaxed = !highLightOptions.isHighlight && !highLightOptions.canHighlight
  const oldDisplayImageUrl = post.displayImageUrl;

  const form = useForm<FormValues>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: {
      ...post,
      releaseDate: post.releaseDate
        ? format(new Date(post.releaseDate), "yyyy-MM-dd'T'HH:mm")
        : undefined,
      isHighlight: highLightOptions.isHighlight,
      displayImage: oldDisplayImageUrl,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const dirtyValues = getDirtyValues(form.formState.dirtyFields, values);

      // should use dirty values for below aswell
      const response = await fetch(`/api/admin/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          slug: values.slug,
          content: values.content,
          excerpt: values.excerpt,
          releaseDate: values.releaseDate,
          displayImage: values.displayImage,
          oldDisplayImageUrl,
          tags: values.tags.map((tag) => tag.value),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Post updated successfully!");
      } else {
        throw new Error(data.message || "Failed to update post");
      }

      if (Object.hasOwn(dirtyValues, "isHighlight")) {
        let response: Response;
        if (values.isHighlight) {
          response = await fetch(`/api/admin/highlights`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              post_id: post.id,
            })
          });
        } else {
          response = await fetch(`/api/admin/highlights`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              post_id: post.id
            })
          });
        }
        const data = await response.json();
        if (response.ok) {
          alert("Highlights updated successfully!");
        } else {
          throw new Error(data.message || "Failed to update highlights");
        }
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
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
        {/* Title */}
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
        {/* Slug */}
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
        {/* Content */}
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
        {/* Excerpt */}
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
        {/* Release Date */}
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
        {/* Display Image */}
        <FormField
          control={form.control}
          name="displayImage"
          render={({ field: { value, ...field } }) => (
            <FormItem>
              <FormLabel>Display Image</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-4">
                  <Input
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
        {/* Tags */}
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
        <FormField
          control={form.control}
          name="isHighlight"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  disabled={highlightsMaxed}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="mx-2">Highlight insight</FormLabel>
              {highlightsMaxed && (
                  <p className="text-sm text-muted-foreground">
                    Maximum highlights for insights reached!
                  </p>
                )}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating Post...
            </>
          ) : (
            "Update Post"
          )}
        </Button>
      </form>
    </Form>
  );
};
