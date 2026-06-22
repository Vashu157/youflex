import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import {neon} from "@neondatabase/serverless";

const sql = neon(process.env.DB_URL)

return drizzle(sql);