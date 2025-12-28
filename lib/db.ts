import { PrismaClient } from "@prisma/client";

// const prismaOptions: PrismaClientOptions = {
//   log: ["query", "info", "warn", "error"],
// }

// const prismaClientSingleton = () => {
//   return new PrismaClient({...prismaOptions});
// };

// declare global {
//   var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
// }

// const prisma = globalThis.prisma ?? prismaClientSingleton();

// export default prisma;

// if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prismaClient = new PrismaClient({ adapter });
export {
  prismaClient
}

