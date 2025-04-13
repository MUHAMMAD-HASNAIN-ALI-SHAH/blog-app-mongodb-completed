import {
  Button,
  FileInput,
  Group,
  TextInput,
  Textarea,
  Image,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import useBlogStore from "../../store/blog";
import axiosInstance from "../../utils/axios";
import toast from "react-hot-toast";

const EditBlog = ({ id, onClose }: { id: string | null; onClose: any }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const { updateBlog, submitionState, getBlogs } = useBlogStore();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      description: "",
      image: null as File | null,
      base64Image: "",
    },

    validate: {
      title: (value) => (value.trim().length > 0 ? null : "Title is required"),
      description: (value) =>
        value.trim().length > 10
          ? null
          : "Description must be at least 10 characters",
      base64Image: (value) => (value ? null : "Image is required"),
    },
  });

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const response = await axiosInstance.get(`/v2/blog/blog/${id}`);
        form.setFieldValue("title", response.data.blogData.title);
        form.setFieldValue("description", response.data.blogData.description);
        form.setFieldValue("base64Image", response.data.blogData.image);
        setPreview(response.data.blogData.image);
      } catch (error) {
        toast.error("Failed to fetch blog", { duration: 3000 });
        console.error(error);
      }
    };
    getBlogs();
  }, [id]);

  // Convert image to Base64
  const handleImageChange = (file: File | null) => {
    form.setFieldValue("image", file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        form.setFieldValue("base64Image", base64String);
        setPreview(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      form.setFieldValue("base64Image", "");
      setPreview(null);
    }
  };

  const handleSubmit = async (values: {
    title: string;
    description: string;
    base64Image: string;
  }) => {
    const data = {
      _id:id,
      title: values.title,
      description: values.description,
      image: values.base64Image,
    };
    await updateBlog(data);
    await getBlogs();
    onClose();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        withAsterisk
        label="Title"
        placeholder="Enter blog title"
        {...form.getInputProps("title")}
      />

      <Textarea
        withAsterisk
        label="Description"
        placeholder="Enter blog description"
        minRows={5}
        autosize
        maxRows={10}
        {...form.getInputProps("description")}
      />

      <FileInput
        withAsterisk
        label="Upload Image"
        placeholder="Select an image"
        accept="image/*"
        onChange={handleImageChange}
      />
      {form.errors.base64Image && (
        <div style={{ color: "red", fontSize: "14px" }}>
          {form.errors.base64Image}
        </div>
      )}

      {preview && (
        <div className="mt-4 flex justify-center">
          <Image
            src={preview}
            alt="Uploaded preview"
            width={200}
            height={200}
            radius="md"
          />
        </div>
      )}

      <Group justify="flex-end" mt="md">
        <Button type="submit" disabled={!!submitionState}>
          Update
        </Button>
      </Group>
    </form>
  );
};

export default EditBlog;
