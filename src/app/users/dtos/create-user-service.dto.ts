import { CreateFileDto } from "../../files/dtos/create-file.dto";
import { CreateUserDto } from "./create-user.dto";

export interface CreateUserServiceDto extends Omit<CreateUserDto, "image"> {
  image: CreateFileDto;
}
