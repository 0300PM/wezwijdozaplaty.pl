import { prisma } from "@/lib/prisma";
import { generatePDF } from "../../../lib/pdf";
import fs from "fs";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    const order = await prisma.order.findUnique({
        where: { stripeSessionId: sessionId! },
    });

    if (!order || order.status !== "paid") {
        return new Response("Unauthorized", { status: 403 });
    }

    const filePath = await generatePDF(order.id);
    const file = fs.readFileSync(filePath);

    return new Response(file, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=wezwanie.pdf",
        },
    });
}