import { NextResponse } from "next/server";
import { badRequest, getErrorMessage, parseJsonBody, serverError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(patients);
  } catch (error) {
    return serverError(getErrorMessage(error, "Unable to load patients."));
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody(request);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const dateOfBirth = typeof body.dateOfBirth === "string" ? body.dateOfBirth : "";

    if (!name) {
      return badRequest("Patient name is required.");
    }

    if (dateOfBirth && Number.isNaN(new Date(dateOfBirth).getTime())) {
      return badRequest("Patient date of birth must be a valid date.");
    }

    const patient = await prisma.patient.create({
      data: {
        name,
        email: email || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_JSON") {
      return badRequest("Request body must be valid JSON.");
    }

    const message = getErrorMessage(error, "Unable to create patient.");
    const status = message.includes("unique") || message.includes("exists") ? 400 : 500;

    return NextResponse.json({ error: message === "A record with the same unique value already exists." ? "That patient email is already in use." : message }, { status });
  }
}
