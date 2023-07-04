import { CreateUserServiceDto } from "./create-user-service.dto";

export interface UpdateUserServiceDto
  extends Partial<Omit<CreateUserServiceDto, "image">> {
  image?: {
    _id: string;
    filename: string;
    mimetype: string;
  };
}
