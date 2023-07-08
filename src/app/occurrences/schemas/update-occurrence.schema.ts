import { object, string } from "yup";

const updateOccurrenceSchema = object().shape({
  name: string().min(1),
  content: string().min(1),
  kind: string().oneOf(["session", "relevant-fact"]),
});

export default updateOccurrenceSchema;
