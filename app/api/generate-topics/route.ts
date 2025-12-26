import {
  GoogleGenerativeAI,
  SchemaType,
  ResponseSchema,
} from "@google/generative-ai";
import {NextRequest, NextResponse} from "next/server";

// アプリケーション内で使う型定義
type Topic = {
  id: number;
  theme: string;
};

// Gemini APIに渡すためのスキーマ定義
const responseSchema: ResponseSchema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      id: {type: SchemaType.NUMBER},
      theme: {type: SchemaType.STRING},
    },
    required: ["id", "theme"],
  },
};

const SYSTEM_INSTRUCTION = `あなたは、協力型ボードゲーム「ito（イト）」のコンテンツ生成エンジンです。
ユーザーからのオーダー（要望）に基づいて、ゲームが盛り上がる「お題」を3つ生成してください。

## ゲームのルール
1〜100の数字カードを配られたプレイヤーが、数字を口にせず、「お題」に沿った言葉で自分の数字を表現し、全員で協力して小さい順にカードを出すゲーム。

## 良問（採用すべきお題）の条件
1. **主観的であること**: 正解がなく、個人の価値観や経験に依存するもの。
2. **グラデーションがあること**: 0か100かの二択ではなく、中間（40〜60）の回答が無数に想像できるもの。
3. **普遍的であること**: 専門知識が不要で、誰でも参加できるテーマであること。`;

export async function POST(request: NextRequest) {
  try {
    const {userInput} = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {error: "GEMINI_API_KEY is not configured"},
        {status: 500}
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // 重要: gemini-pro は JSON Schema に対応していないため、
    // 必ず gemini-1.5-flash (または gemini-1.5-pro) を使用してください。
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const userPrompt = `オーダー:
"""
${userInput || "特になし"}
"""`;

    const result = await model.generateContent(userPrompt);
    const response = await result.response;

    // JSONモードを使用しているため、テキストは純粋なJSON文字列として返されます
    const topics: Topic[] = JSON.parse(response.text());

    return NextResponse.json({topics});
  } catch (error: unknown) {
    // サーバー側のコンソールに詳細なエラーを出力する（デバッグ用）
    console.error("Error generating topics:", error);

    // API呼び出しエラーの詳細をクライアントに返す
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to generate topics",
        details: errorMessage,
      },
      {status: 500}
    );
  }
}
