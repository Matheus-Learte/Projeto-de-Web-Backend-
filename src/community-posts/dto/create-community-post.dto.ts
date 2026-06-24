export class CreateCommunityPostDto {
  title!: string;
  content?: string;
  image?: string;

  authorId!: string;
  communityId!: string;
}