import { object, string } from "yup";

const createTimelineSchema = object().shape({
  name: string().required(),
});

export default createTimelineSchema;
