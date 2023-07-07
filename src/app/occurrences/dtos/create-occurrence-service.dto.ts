import { CreateOccurrenceDto } from "./create-occurrence.dto";
import { CreateFileDto } from "../../files/dtos/create-file.dto";

export interface CreateOccurrenceServiceDto
  extends Omit<CreateOccurrenceDto, "files"> {
  files?: CreateFileDto[];
}
