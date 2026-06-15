export class UserResponseDto {
  id!: string;
  email!: string;
  username!: string;
  role!: string;
  bio?: string;
  avatar?: string;
  pronoun?: string;
  studyTime!: number;
}