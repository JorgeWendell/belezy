"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_BARBERSHOP_IMAGE =
  "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1200&q=80";
const DEFAULT_SERVICE_IMAGE =
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80";

function parsePriceToCents(rawPrice: string) {
  const normalized = rawPrice.replace(",", ".").trim();
  const price = Number(normalized);
  if (!Number.isFinite(price) || price <= 0) {
    return null;
  }

  return Math.round(price * 100);
}

export async function createBarbershop(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/");
  }

  const name = formData.get("name")?.toString().trim() ?? "";
  const address = formData.get("address")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const imageUrl = formData.get("imageUrl")?.toString().trim() ?? "";

  if (!name || !address || !description || !phone) {
    redirect("/dashboard?error=missing-barbershop-fields");
  }

  const existingBarbershop = await prisma.babershop.findUnique({
    where: {
      ownerId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (existingBarbershop) {
    redirect("/dashboard?error=barbershop-already-exists");
  }

  await prisma.babershop.create({
    data: {
      name,
      address,
      description,
      phones: [phone],
      imageUrl: imageUrl || DEFAULT_BARBERSHOP_IMAGE,
      ownerId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard?success=barbershop-created");
}

export async function createService(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/");
  }

  const barbershop = await prisma.babershop.findUnique({
    where: {
      ownerId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!barbershop) {
    redirect("/dashboard?error=create-barbershop-first");
  }

  const name = formData.get("name")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const durationInMinutes = Number(formData.get("durationInMinutes") ?? 0);
  const priceInCents = parsePriceToCents(formData.get("price")?.toString() ?? "");
  const imageUrl = formData.get("imageUrl")?.toString().trim() ?? "";

  if (!name || !description || !priceInCents || durationInMinutes < 5) {
    redirect("/dashboard?error=invalid-service-data");
  }

  await prisma.babershopService.create({
    data: {
      name,
      description: `${description} (${durationInMinutes} min)`,
      imageUrl: imageUrl || DEFAULT_SERVICE_IMAGE,
      priceInCents,
      babershopId: barbershop.id,
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard?success=service-created");
}

export async function updateBarbershop(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/");
  }

  const name = formData.get("name")?.toString().trim() ?? "";
  const address = formData.get("address")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const imageUrl = formData.get("imageUrl")?.toString().trim() ?? "";

  if (!name || !address || !description || !phone) {
    redirect("/dashboard?error=missing-barbershop-fields");
  }

  const barbershop = await prisma.babershop.findUnique({
    where: {
      ownerId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!barbershop) {
    redirect("/dashboard?error=create-barbershop-first");
  }

  await prisma.babershop.update({
    where: {
      id: barbershop.id,
    },
    data: {
      name,
      address,
      description,
      phones: [phone],
      imageUrl: imageUrl || DEFAULT_BARBERSHOP_IMAGE,
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateService(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/");
  }

  const serviceId = formData.get("serviceId")?.toString().trim() ?? "";
  const name = formData.get("name")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const priceInCents = parsePriceToCents(formData.get("price")?.toString() ?? "");
  const imageUrl = formData.get("imageUrl")?.toString().trim() ?? "";

  if (!serviceId || !name || !description || !priceInCents) {
    redirect("/dashboard?error=invalid-service-data");
  }

  const service = await prisma.babershopService.findFirst({
    where: {
      id: serviceId,
      babershop: {
        ownerId: session.user.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (!service) {
    redirect("/dashboard?error=service-not-found");
  }

  await prisma.babershopService.update({
    where: {
      id: service.id,
    },
    data: {
      name,
      description,
      priceInCents,
      imageUrl: imageUrl || DEFAULT_SERVICE_IMAGE,
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard?success=service-updated");
}
