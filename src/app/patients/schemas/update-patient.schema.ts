import { object, string, date } from "yup";

const updatePatientSchema = object().shape({
  name: string(),
  contact: string(),
  birthdate: date(),
  demands: string(),
  personalAnnotations: string(),
});

export default updatePatientSchema;
