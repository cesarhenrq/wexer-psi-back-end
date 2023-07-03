import { object, string } from "yup";

const loginSchema = object().shape({
  email: string().email().required(),
  password: string().min(6).required(),
});

export default loginSchema;
