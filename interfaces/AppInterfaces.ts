import { Timestamp } from "firebase/firestore";

export interface Welcome {
    candidates: Candidate[];
    usageMetadata: UsageMetadata;
    modelVersion: string;
}

export interface Candidate {
    content: Content;
    finishReason: string;
    avgLogprobs: number;
}

export interface Content {
    parts: Part[];
    role: string;
}

export interface Part {
    text: string;
}

export interface UsageMetadata {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
    promptTokensDetails: TokensDetail[];
    candidatesTokensDetails: TokensDetail[];
}

export interface TokensDetail {
    modality: string;
    tokenCount: number;
}

export interface Message {
    text: string;
    sender_by: "Bot" | "Me";
    date: Date;
    state: "received" | "viewed";
}

export interface FirestoreChat {
    id: string;
    title: string;
    userid: string;
    created_at: Timestamp;
    messages: Message[];
}