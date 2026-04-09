import { NextResponse } from "next/server";
import { badRequest, getErrorMessage, parseJsonBody, serverError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const clinicians = await prisma.clinician.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(clinicians);
  } catch (error) {
    return serverError(getErrorMessage(error, "Unable to load clinicians."));
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody(request);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const specialty = typeof body.specialty === "string" ? body.specialty.trim() : "";

    if (!name) {
      return badRequest("Clinician name is required.");
    }

    const clinician = await prisma.clinician.create({
      data: {
        name,
        specialty: specialty || null,
      },
    });

    return NextResponse.json(clinician, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_JSON") {
      return badRequest("Request body must be valid JSON.");
    }

    return serverError(getErrorMessage(error, "Unable to create clinician."));
  }
}
