// Seed inicial idempotente: crea lo que falta y no pisa lo editado (upsert con update vacío).
// Se ejecuta en development y preview hasta que el producto esté en producción; en production se niega a correr.
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import argon2 from 'argon2'

import { PrismaClient } from '../src/generated/prisma/client.js'

const requireEnv = (name: string): string => {
    const value = process.env[name]?.trim()

    if (!value) throw new Error(`Falta la variable de entorno ${name} para el seed (ver apps/api/.env.example).`)

    return value
}

if (process.env.APP_ENV === 'production') throw new Error('El seed no se ejecuta con APP_ENV=production.')

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: requireEnv('DIRECT_URL') }) })

// IDs fijos: volver a correr el seed encuentra los mismos registros en vez de duplicarlos.
const ID = {
    clients: [
        '01990000-0000-7000-8000-00000000c001',
        '01990000-0000-7000-8000-00000000c002',
        '01990000-0000-7000-8000-00000000c003',
        '01990000-0000-7000-8000-00000000c004',
        '01990000-0000-7000-8000-00000000c005',
        '01990000-0000-7000-8000-00000000c006',
    ],
    seller: '01990000-0000-7000-8000-00000000a002',
} as const

const DAY_MS = 24 * 60 * 60 * 1000
const daysAgo = (days: number): Date => new Date(Date.now() - days * DAY_MS)

const seedUsers = async (): Promise<{ adminId: string; sellerId: string }> => {
    const passwordHash = await argon2.hash(requireEnv('SEED_ADMIN_PASSWORD'))

    const admin = await prisma.user.upsert({
        create: {
            email: requireEnv('SEED_ADMIN_EMAIL').toLowerCase(),
            name: requireEnv('SEED_ADMIN_NAME'),
            passwordHash,
            role: 'ADMIN',
        },
        update: {},
        where: { email: requireEnv('SEED_ADMIN_EMAIL').toLowerCase() },
    })

    const seller = await prisma.user.upsert({
        create: { email: 'ventas@windkode.com', id: ID.seller, name: 'Valeria Quispe', passwordHash, role: 'SELLER' },
        update: {},
        where: { id: ID.seller },
    })

    return { adminId: admin.id, sellerId: seller.id }
}

const seedClients = async ({ adminId, sellerId }: { adminId: string; sellerId: string }): Promise<void> => {
    const clients = [
        {
            company: 'Café Altura',
            email: 'mariana@cafealtura.bo',
            jobTitle: 'Gerente general',
            name: 'Mariana Rojas',
            ownerId: sellerId,
            phone: '+591 71234567',
            source: 'WHATSAPP',
            status: 'INTERESTED',
            valueProposition:
                'Pedidos en línea con pago QR y menú digital: menos llamadas y pedidos más rápidos en hora pico.',
        },
        {
            company: 'Transportes Illimani',
            email: 'jorge.mamani@illimani.com.bo',
            jobTitle: 'Jefe de operaciones',
            name: 'Jorge Mamani',
            ownerId: adminId,
            phone: '+591 76543210',
            source: 'REFERRAL',
            status: 'ACCEPTED',
            valueProposition:
                'Automatizar la asignación de rutas y el seguimiento de entregas, hoy en planillas de Excel.',
        },
        {
            company: 'Clínica Santa Cruz',
            email: 'lucia.vargas@clinicasc.bo',
            jobTitle: 'Directora administrativa',
            name: 'Lucía Vargas',
            ownerId: sellerId,
            phone: '+591 77889900',
            source: 'WEB',
            status: 'CONTACTED',
            valueProposition: 'Agenda de citas en línea con recordatorios por WhatsApp para reducir las inasistencias.',
        },
        {
            company: 'Ferretería El Constructor',
            email: null,
            jobTitle: 'Dueño',
            name: 'Ramiro Choque',
            ownerId: sellerId,
            phone: '+591 70011223',
            source: 'SOCIAL',
            status: 'NO_RESPONSE',
            valueProposition: 'Control de inventario y catálogo web para vender por mayor.',
        },
        {
            company: 'Colegio Nuevo Horizonte',
            email: 'direccion@nuevohorizonte.edu.bo',
            jobTitle: 'Directora',
            name: 'Patricia Flores',
            ownerId: adminId,
            phone: '+591 72233445',
            source: 'WEB',
            status: 'REJECTED',
            valueProposition: 'Plataforma de notas y comunicados para padres.',
        },
        {
            company: null,
            email: 'andres.gutierrez@gmail.com',
            jobTitle: 'Emprendedor',
            name: 'Andrés Gutiérrez',
            ownerId: adminId,
            phone: null,
            source: 'OTHER',
            status: 'NEW',
            valueProposition: null,
        },
    ] as const

    await Promise.all(
        clients.map((client, index) =>
            prisma.client.upsert({
                create: { ...client, id: ID.clients[index]!, notes: null },
                update: {},
                where: { id: ID.clients[index]! },
            }),
        ),
    )

    const activities = [
        {
            authorId: sellerId,
            clientId: ID.clients[0],
            id: '01990000-0000-7000-8000-0000000ac001',
            occurredAt: daysAgo(6),
            summary: 'Escribió por WhatsApp preguntando por pedidos en línea.',
            type: 'WHATSAPP',
        },
        {
            authorId: sellerId,
            clientId: ID.clients[0],
            id: '01990000-0000-7000-8000-0000000ac002',
            occurredAt: daysAgo(2),
            summary: 'Reunión en el local: quiere menú digital y pago con QR antes de fin de mes.',
            type: 'MEETING',
        },
        {
            authorId: adminId,
            clientId: ID.clients[1],
            id: '01990000-0000-7000-8000-0000000ac003',
            occurredAt: daysAgo(10),
            summary: 'Llamada de presentación, lo recomendó un cliente anterior.',
            type: 'CALL',
        },
        {
            authorId: adminId,
            clientId: ID.clients[1],
            id: '01990000-0000-7000-8000-0000000ac004',
            occurredAt: daysAgo(3),
            summary: 'Aceptó la propuesta. Se agenda el kickoff.',
            type: 'EMAIL',
        },
        {
            authorId: sellerId,
            clientId: ID.clients[2],
            id: '01990000-0000-7000-8000-0000000ac005',
            occurredAt: daysAgo(4),
            summary: 'Llenó el formulario del sitio web; se le respondió por correo.',
            type: 'EMAIL',
        },
        {
            authorId: sellerId,
            clientId: ID.clients[3],
            id: '01990000-0000-7000-8000-0000000ac006',
            occurredAt: daysAgo(15),
            summary: 'Se le escribió por Facebook, sin respuesta todavía.',
            type: 'WHATSAPP',
        },
        {
            authorId: adminId,
            clientId: ID.clients[4],
            id: '01990000-0000-7000-8000-0000000ac007',
            occurredAt: daysAgo(20),
            summary: 'Rechazó por presupuesto; volver a contactar el próximo año.',
            type: 'CALL',
        },
    ] as const

    await Promise.all(
        activities.map((activity) =>
            prisma.clientActivity.upsert({ create: activity, update: {}, where: { id: activity.id } }),
        ),
    )

    await Promise.all(
        ID.clients.map(async (clientId) => {
            const last = await prisma.clientActivity.findFirst({
                orderBy: { occurredAt: 'desc' },
                select: { occurredAt: true },
                where: { clientId },
            })

            if (last) await prisma.client.update({ data: { lastActivityAt: last.occurredAt }, where: { id: clientId } })
        }),
    )
}

const seedDeals = async ({ adminId, sellerId }: { adminId: string; sellerId: string }): Promise<void> => {
    const deals = [
        {
            amount: '4500.00',
            clientId: ID.clients[0],
            currency: 'BOB',
            expectedCloseAt: daysAgo(-20),
            id: '01990000-0000-7000-8000-0000000d0001',
            ownerId: sellerId,
            position: 0,
            stage: 'PROPOSAL',
            title: 'Menú digital y pedidos con QR',
        },
        {
            amount: '1800.00',
            clientId: ID.clients[1],
            currency: 'USD',
            expectedCloseAt: daysAgo(3),
            id: '01990000-0000-7000-8000-0000000d0002',
            ownerId: adminId,
            position: 0,
            stage: 'WON',
            title: 'Sistema de rutas y entregas',
        },
        {
            amount: '6200.00',
            clientId: ID.clients[2],
            currency: 'BOB',
            expectedCloseAt: daysAgo(-35),
            id: '01990000-0000-7000-8000-0000000d0003',
            ownerId: sellerId,
            position: 0,
            stage: 'CONTACTED',
            title: 'Agenda de citas con recordatorios',
        },
        {
            amount: '3000.00',
            clientId: ID.clients[3],
            currency: 'BOB',
            expectedCloseAt: null,
            id: '01990000-0000-7000-8000-0000000d0004',
            ownerId: sellerId,
            position: 0,
            stage: 'LEAD',
            title: 'Inventario y catálogo web',
        },
        {
            amount: '2500.00',
            clientId: ID.clients[4],
            currency: 'BOB',
            expectedCloseAt: null,
            id: '01990000-0000-7000-8000-0000000d0005',
            ownerId: adminId,
            position: 0,
            stage: 'LOST',
            title: 'Plataforma de notas para padres',
        },
        {
            amount: '900.00',
            clientId: ID.clients[5],
            currency: 'USD',
            expectedCloseAt: null,
            id: '01990000-0000-7000-8000-0000000d0006',
            ownerId: adminId,
            position: 1,
            stage: 'LEAD',
            title: 'Landing para emprendimiento',
        },
    ] as const

    await Promise.all(deals.map((deal) => prisma.deal.upsert({ create: deal, update: {}, where: { id: deal.id } })))
}

try {
    const users = await seedUsers()

    await seedClients(users)
    await seedDeals(users)
    process.stdout.write('Seed completado: usuarios, clientes, interacciones y oportunidades.\n')
} finally {
    await prisma.$disconnect()
}
