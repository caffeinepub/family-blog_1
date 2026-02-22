import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Post {
    id: string;
    title: string;
    content: string;
    owner: Principal;
    authorName: string;
    likes: bigint;
    publicationDate: string;
    comments: Array<Comment>;
}
export interface Comment {
    content: string;
    authorName: string;
    timestamp: bigint;
}
export interface backendInterface {
    addComment(postId: string, authorName: string, content: string): Promise<void>;
    createPost(title: string, content: string, authorName: string): Promise<string>;
    deletePost(id: string): Promise<void>;
    getAllPosts(): Promise<Array<Post>>;
    getPost(id: string): Promise<Post>;
    likePost(id: string): Promise<void>;
    updatePost(id: string, title: string, content: string): Promise<void>;
}
