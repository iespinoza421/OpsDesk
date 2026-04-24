import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma, Status, Priority } from "@prisma/client";

const validStatuses: Status[] = ["OPEN", "IN_PROGRESS", "CLOSED"];
const validPriorities: Priority[] = ["LOW", "MEDIUM", "HIGH"];

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status");

    const where: Prisma.TicketWhereInput = {};

    if (statusParam && statusParam !== "ALL") {
      if (!validStatuses.includes(statusParam as Status)) {
        return NextResponse.json(
          { error: "Invalid status value" },
          { status: 400 }
        );
      }

      where.status = statusParam as Status;
    }

    if (session.user.role === "USER") {
      where.OR = [
        { createdById: session.user.id },
        { assignedToId: session.user.id },
      ];
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("GET_TICKETS_ERROR", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const ticket = await prisma.ticket.create({
      data: {
        title: String(title).trim(),
        description: String(description).trim(),
        createdById: session.user.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("CREATE_TICKET_ERROR", error);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, title, description, status, priority, assignedToId } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    if (status && !validStatuses.includes(status as Status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    if (priority && !validPriorities.includes(priority as Priority)) {
      return NextResponse.json(
        { error: "Invalid priority value" },
        { status: 400 }
      );
    }

    if (title !== undefined && !String(title).trim()) {
      return NextResponse.json(
        { error: "Title cannot be empty" },
        { status: 400 }
      );
    }

    if (description !== undefined && !String(description).trim()) {
      return NextResponse.json(
        { error: "Description cannot be empty" },
        { status: 400 }
      );
    }

    const existingTicket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!existingTicket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    const canEditBasic =
      session.user.role === "ADMIN" ||
      session.user.role === "MANAGER" ||
      existingTicket.createdById === session.user.id ||
      existingTicket.assignedToId === session.user.id;

    if (!canEditBasic) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const canAssign =
      session.user.role === "ADMIN" || session.user.role === "MANAGER";

    if (assignedToId !== undefined && !canAssign) {
      return NextResponse.json(
        { error: "Only ADMIN or MANAGER can assign tickets" },
        { status: 403 }
      );
    }

    const dataToUpdate: {
      title?: string;
      description?: string;
      status?: Status;
      priority?: Priority;
      assignedToId?: string | null;
    } = {};

    if (title !== undefined) {
      dataToUpdate.title = String(title).trim();
    }

    if (description !== undefined) {
      dataToUpdate.description = String(description).trim();
    }

    if (status) {
      dataToUpdate.status = status as Status;
    }

    if (priority) {
      dataToUpdate.priority = priority as Priority;
    }

    if (assignedToId !== undefined) {
      dataToUpdate.assignedToId = assignedToId || null;
    }

    if (
      dataToUpdate.title === undefined &&
      dataToUpdate.description === undefined &&
      dataToUpdate.status === undefined &&
      dataToUpdate.priority === undefined &&
      dataToUpdate.assignedToId === undefined
    ) {
      return NextResponse.json(
        { error: "Nothing to update" },
        { status: 400 }
      );
    }

    const activities: {
      action: string;
      field?: string;
      oldValue?: string | null;
      newValue?: string | null;
      ticketId: string;
      actorId: string;
    }[] = [];

    if (
      dataToUpdate.title !== undefined &&
      dataToUpdate.title !== existingTicket.title
    ) {
      activities.push({
        action: "UPDATED_TITLE",
        field: "title",
        oldValue: existingTicket.title,
        newValue: dataToUpdate.title,
        ticketId: existingTicket.id,
        actorId: session.user.id,
      });
    }

    if (
      dataToUpdate.description !== undefined &&
      dataToUpdate.description !== existingTicket.description
    ) {
      activities.push({
        action: "UPDATED_DESCRIPTION",
        field: "description",
        oldValue: existingTicket.description,
        newValue: dataToUpdate.description,
        ticketId: existingTicket.id,
        actorId: session.user.id,
      });
    }

    if (
      dataToUpdate.status !== undefined &&
      dataToUpdate.status !== existingTicket.status
    ) {
      activities.push({
        action: "UPDATED_STATUS",
        field: "status",
        oldValue: existingTicket.status,
        newValue: dataToUpdate.status,
        ticketId: existingTicket.id,
        actorId: session.user.id,
      });
    }

    if (
      dataToUpdate.priority !== undefined &&
      dataToUpdate.priority !== existingTicket.priority
    ) {
      activities.push({
        action: "UPDATED_PRIORITY",
        field: "priority",
        oldValue: existingTicket.priority,
        newValue: dataToUpdate.priority,
        ticketId: existingTicket.id,
        actorId: session.user.id,
      });
    }

    if (dataToUpdate.assignedToId !== undefined) {
      const oldAssigned = existingTicket.assignedToId ?? null;
      const newAssigned = dataToUpdate.assignedToId ?? null;

      if (oldAssigned !== newAssigned) {
        activities.push({
          action: "UPDATED_ASSIGNEE",
          field: "assignedToId",
          oldValue: oldAssigned,
          newValue: newAssigned,
          ticketId: existingTicket.id,
          actorId: session.user.id,
        });
      }
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: dataToUpdate,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (activities.length > 0) {
      await prisma.ticketActivity.createMany({
        data: activities,
      });
    }

    if (
  dataToUpdate.assignedToId !== undefined &&
  dataToUpdate.assignedToId &&
  dataToUpdate.assignedToId !== existingTicket.assignedToId &&
  dataToUpdate.assignedToId !== session.user.id
) {
  await prisma.notification.create({
    data: {
      userId: dataToUpdate.assignedToId,
      ticketId: existingTicket.id,
      title: "Ticket assigned to you",
      message: `You were assigned to "${ticket.title}".`,
    },
  });
}

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("UPDATE_TICKET_ERROR", error);
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}