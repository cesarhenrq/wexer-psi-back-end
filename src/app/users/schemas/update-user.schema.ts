import { object, string } from "yup";

const updateUserSchema = object().shape({
  name: string(),
  email: string().email(),
  password: string().min(6),
});

export default updateUserSchema;
