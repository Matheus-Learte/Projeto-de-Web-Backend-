export class CreatePostDto {
  title!: string;
  content!: string;
  image?: string;
  authorId!: string;
}