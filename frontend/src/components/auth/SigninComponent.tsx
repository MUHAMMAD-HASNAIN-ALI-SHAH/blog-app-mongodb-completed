import { useForm } from "@mantine/form";
import { TextInput, Button } from "@mantine/core";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/auth";

const SigninComponent = () => {
  const { signin } = useAuthStore();
  const form = useForm({
    initialValues: { email: "", password: "" },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length == 0 ? "Please enter the password" : null,
    },
  });

  return (
    <div className="w-full flex justify-center">
      <form
        className="w-full mx-4 sm:w-2/3 md:3/4 mt-20"
        onSubmit={form.onSubmit((values) => signin(values))}
      >
        <h1 className="text-2xl font-bold pb-2">Signin to continue</h1>
        <p className="">Please enter your email and password</p>
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
          key={form.key("password")}
          {...form.getInputProps("password")}
        />

        <p className="pt-3">
          No account{" "}
          <Link to={"/signup"} className="text-blue-700">
            Signup
          </Link>{" "}
        </p>

        <Button type="submit" mt="sm">
          Signin
        </Button>
      </form>
    </div>
  );
};

export default SigninComponent;
