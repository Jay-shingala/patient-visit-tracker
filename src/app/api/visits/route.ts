import { NextResponse } from "next/server";
import { badRequest, getErrorMessage, parseJsonBody, serverError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicianId = searchParams.get("clinicianId");
    const patientId = searchParams.get("patientId");

    const visits = await prisma.visit.findMany({
      where: {
        clinicianId: clinicianId || undefined,
        patientId: patientId || undefined,
      },
      include: {
        clinician: {
          select: {
            id: true,
            name: true,
            specialty: true,
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        visitedAt: "desc",
      },
    });

    return NextResponse.json(visits);
  } catch (error) {
    return serverError(getErrorMessage(error, "Unable to load visits."));
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody(request);
    const clinicianId = typeof body.clinicianId === "string" ? body.clinicianId : "";
    const patientId = typeof body.patientId === "string" ? body.patientId : "";
    const notes = typeof body.notes === "string" ? body.notes.trim() : "";
    const visitedAt = typeof body.visitedAt === "string" ? body.visitedAt : "";

    if (!clinicianId || !patientId) {
      return badRequest("Clinician and patient are required to record a visit.");
    }

    if (visitedAt && Number.isNaN(new Date(visitedAt).getTime())) {
      return badRequest("Visit date must be a valid date.");
    }

    const [clinician, patient] = await Promise.all([
      prisma.clinician.findUnique({ where: { id: clinicianId } }),
      prisma.patient.findUnique({ where: { id: patientId } }),
    ]);

    if (!clinician || !patient) {
      return NextResponse.json(
        { error: "Selected clinician or patient could not be found." },
        { status: 404 },
      );
    }

    const visit = await prisma.visit.create({
      data: {
        clinicianId,
        patientId,
        notes: notes || null,
        visitedAt: visitedAt ? new Date(visitedAt) : new Date(),
      },
      include: {
        clinician: {
          select: {
            id: true,
            name: true,
            specialty: true,
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(visit, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_JSON") {
      return badRequest("Request body must be valid JSON.");
    }

    return serverError(getErrorMessage(error, "Unable to record visit."));
  }
}
