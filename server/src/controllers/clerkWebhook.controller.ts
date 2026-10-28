/** Handles API requests for Clerk Webhook Controller. */
import { Request, Response } from "express";
import { Webhook } from "svix";
import { prisma } from "../config/db";
import { env } from "../config/env";

export const clerkWebhook = async (req: Request, res: Response) => {
  try {
    // Webhook secret not configured yet
    if (!env.CLERK_WEBHOOK_SECRET) {
      return res
        .status(500)
        .json({ message: "CLERK_WEBHOOK_SECRET is missing." });
    }

    const payload = req.body.toString();

    const headers = {
      "svix-id": req.headers["svix-id"] as string,
      "svix-timestamp": req.headers["svix-timestamp"] as string,
      "svix-signature": req.headers["svix-signature"] as string,
    };

    const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);

    const event = wh.verify(payload, headers) as any;

    switch (event.type) {
      case "user.created": {
        const user = event.data;

        await prisma.user.upsert({
          where: {
            clerkId: user.id,
          },
          update: {
            email: user.email_addresses?.[0]?.email_address ?? "",
            name:
              `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
          },
          create: {
            clerkId: user.id,
            email: user.email_addresses?.[0]?.email_address ?? "",
            name:
              `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
          },
        });

        console.log("✅ Clerk user created");
        break;
      }

      case "user.updated": {
        const user = event.data;

        await prisma.user.update({
          where: {
            clerkId: user.id,
          },
          data: {
            email: user.email_addresses?.[0]?.email_address ?? "",
            name:
              `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
          },
        });

        console.log("✏️ Clerk user updated");
        break;
      }

      case "user.deleted": {
        const user = event.data;

        if (user.id) {
          await prisma.user.deleteMany({
            where: {
              clerkId: user.id,
            },
          });

          console.log("🗑 Clerk user deleted");
        }

        break;
      }

      default:
        console.log("Webhook:", event.type);
    }

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return res.status(400).json({
      message: "Webhook Error",
    });
  }
};