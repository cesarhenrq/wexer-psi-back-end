import { object, string } from "yup";

const updateTimelineSchema = object().shape({
  name: string().min(1),
});

export default updateTimelineSchema;
