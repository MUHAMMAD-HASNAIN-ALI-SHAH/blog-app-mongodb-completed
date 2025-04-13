import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import useBlogStore from "../../store/blog";
import useHomeBlogStore from "../../store/home";

interface CommentsProps {
  id: string;
  onClose: () => void;
  blogId: string;
}

const AddComment = ({ id, onClose, blogId }: CommentsProps) => {
  const { submitionState, addComment } = useBlogStore();
  const { getBlogData } = useHomeBlogStore();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      comment: "",
    },

    validate: {
      comment: (value) =>
        value.trim().length > 0 ? null : "Comment is required",
    },
  });

  const handleSubmit = async (values: { comment: string }) => {
    const data = {
      comment: values.comment,
    };
    await addComment(data, id);
    await getBlogData(blogId);
    onClose();
  };

  return (
    <div>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          withAsterisk
          label="Comment"
          placeholder="Enter the Comment"
          {...form.getInputProps("comment")}
        />
        <Group justify="flex-end" mt="md">
          <Button
            type="submit"
            disabled={
              !!submitionState && !!localStorage.getItem("isAuthenticated")
            }
          >
            Submit
          </Button>
        </Group>
      </form>
    </div>
  );
};

export default AddComment;
