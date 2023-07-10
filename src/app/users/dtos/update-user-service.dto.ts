import { CreateUserServiceDto } from "./create-user-service.dto";

export interface UpdateUserServiceDto
  extends Partial<Omit<CreateUserServiceDto, "image">> {
  image?: {
    filename: string;
    mimetype: string;
  };
}
