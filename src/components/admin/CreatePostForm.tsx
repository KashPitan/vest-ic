"use client";
import { Form, TextInput, SaveButton } from "@payloadcms/ui";

const CreatePostForm: React.FC = () => {
  return (
    <div className="create-post">
      <Form>
        <TextInput label="Title" path="title" required />
        {/* <RichTextField path="content" /> */}
        <TextInput label="Slug" path="slug" required />
        <SaveButton />
      </Form>
    </div>
  );
};

export default CreatePostForm;
