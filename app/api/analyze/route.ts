import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  analysisRequestSchema,
  createAnalysisPrompt,
  roleAnalysisJsonSchema,
  roleAnalysisSchema,
} from "@/lib/role-analysis";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsedRequest = analysisRequestSchema.safeParse(requestBody);

  if (!parsedRequest.success) {
    return NextResponse.json(
      {
        error: "Check the job description and candidate profile.",
        fields: parsedRequest.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY is not configured.");
    return NextResponse.json(
      { error: "Role analysis is temporarily unavailable." },
      { status: 503 },
    );
  }

  try {
    const client = new GoogleGenAI({ apiKey });
    const interaction = await client.interactions.create({
      model: "gemini-3.7-flash",
      input: createAnalysisPrompt(parsedRequest.data),
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: roleAnalysisJsonSchema,
      },
    });

    const rawAnalysis: unknown = JSON.parse(interaction.output_text);
    const analysis = roleAnalysisSchema.parse(rawAnalysis);

    return NextResponse.json({ analysis });
  } catch (error) {
    if (error instanceof ZodError || error instanceof SyntaxError) {
      console.error("Gemini returned an invalid RoleLens response.", error);
    } else {
      console.error("Gemini role analysis failed.", error);
    }

    return NextResponse.json(
      { error: "Role analysis could not be completed. Please try again." },
      { status: 502 },
    );
  }
}
