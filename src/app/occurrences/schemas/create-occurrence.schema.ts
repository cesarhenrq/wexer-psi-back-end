import { object, string } from "yup";

const createOccurrenceSchema = object().shape({
  name: string().required(),
  content: string().required(),
  kind: string().oneOf(["session", "relevant-fact"]).required(),
});

export default createOccurrenceSchema;
