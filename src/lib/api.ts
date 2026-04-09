import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function serverError(message = "Something went wrong. Please try again.") {
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function parseJsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new Error("INVALID_JSON");
  }
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return "A record with the same unique value already exists.";
    }
    if (error.code === "P2025") {
      return "The requested record could not be found.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
