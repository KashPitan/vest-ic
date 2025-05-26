import { login } from "./login";

const Page = async () => {
  return <form action={async (formData) => {
    await login(formData);
  }}>
    <label>Username:</label><input type="text" name="username" ></input>
    <label>Password:</label><input type="text" name="password"></input>
    <button type="submit">Log in</button>
  </form>;
};

export default Page;