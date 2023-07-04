import { object, string, date } from "yup";

const createPatientSchema = object().shape({
  user: string().required(),
  name: string().required(),
  contact: string().required(),
  birthdate: date().required(),
  demands: string(),
  personalAnnotations: string(),
});

export default createPatientSchema;
