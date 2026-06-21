export class UserResponseDto {
  id!: string;
  email!: string;
  username!: string;
  name!: string;
  role!: string;
  bio?: string;
  avatar?: string;
  pronoun?: string;
  studyTime!: number;
}