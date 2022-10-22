import { Layout } from "@components/layout/Layout";
import { v } from "@utils/validator";
import { FormEvent } from "react";

type Event = FormEvent<HTMLFormElement>;

const verifyLogin = () => Promise.resolve(true);
const wait300 = (_: any, resolve: any) => {
  setTimeout(resolve.bind(null, true), 300);
};

const validator = v().formed({
  login: v().required().pipe(verifyLogin).async(wait300),
  password: v().required().min(8).max(50),
});

const Home = () => {
  const handleSubmit = (e: Event) => {
    const form = e.currentTarget;
    validator.done(console.log);
    validator.validate({
      login: form.login.value,
      password: form.password.value,
    });
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <input type="text" name="login" placeholder="Login" />
        <input type="password" name="password" placeholder="Password" />
        <button>Submit</button>
      </form>
    </Layout>
  );
};

export default Home;
