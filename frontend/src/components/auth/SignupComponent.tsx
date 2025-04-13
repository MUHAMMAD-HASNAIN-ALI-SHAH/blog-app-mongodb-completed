import { useForm } from "@mantine/form";
import { TextInput, Button } from "@mantine/core";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/auth";

const SignupComponent = () => {
  const { signup } = useAuthStore();

  const form = useForm({
    initialValues: { username: "", email: "", password: "" },
    validate: {
      username: (value) =>
        value.length < 3 || value.length > 16
          ? "Username must be between 3 and 16 characters"
          : null,
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
    },
  });

  return (
    <div className="w-full flex justify-center">
      <form
        className="w-full mx-4 sm:w-2/3 md:3/4 mt-20"
        onSubmit={form.onSubmit((values) => signup(values))}
      >
        <h1 className="text-2xl font-bold pb-2">Signup to create an account</h1>
        <p className="">Please enter your details</p>

        <TextInput
          mt="sm"
          label="Username"
          placeholder="Username"
          key={form.key("username")}
          {...form.getInputProps("username")}
        />

        <TextInput
          mt="sm"
          label="Email"
          placeholder="Email"
          key={form.key("email")}
          {...form.getInputProps("email")}
        />

        <TextInput
          mt="sm"
          label="Password"
          placeholder="Password"
          type="password"
          key={form.key("password")}
          {...form.getInputProps("password")}
        />

        <p className="pt-3">
          Already have an account{" "}
          <Link to={"/signin"} className="text-blue-700">
            Signin
          </Link>{" "}
        </p>

        <Button type="submit" mt="sm">
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default SignupComponent;
