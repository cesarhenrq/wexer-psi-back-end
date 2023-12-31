import { object, string } from "yup";

const userSchema = object().shape({
  name: string().required(),
  email: string().email().required(),
  password: string().min(6).required(),
});

export default userSchema;
