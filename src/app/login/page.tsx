'use client'
import { login } from "../login";

const Page = () => {
  return <form action={async (formData) => {
    const res = await login(formData);
    console.log('res', res)
  }}>
    <label>Username:</label><input type="text" name="username" ></input>
    <label>Password:</label><input type="text" name="password"></input>
    <button type="submit">Log in</button>
  </form>;
};

export default Page;