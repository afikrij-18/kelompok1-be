import db from "./config/database.js";
import "./models/index.js";
import { QueryTypes } from "sequelize";
const rows = await db.query(`SELECT id, reg_no, status, total_price FROM booking_services WHERE reg_no IN ('BK-20261013-6374','BK-20261013-8453')`, { type: QueryTypes.SELECT });
console.log("BOOKINGS:");
console.table(rows);
const ids = rows.map(r=>r.id);
if(ids.length){
  const units = await db.query(`SELECT bu.id, bu.booking_id, bu.service_id, bu.warranty_expiry_date, bu.price, s.name as layanan, s.warranty_days FROM booking_units bu LEFT JOIN services s ON s.id=bu.service_id WHERE bu.booking_id IN (${ids.join(',')})`, { type: QueryTypes.SELECT });
  console.log("UNITS:");
  console.table(units);
  const pays = await db.query(`SELECT id, booking_id, invoice_no, payment_method, amount_paid, payment_status, payment_date FROM transactions WHERE booking_id IN (${ids.join(',')})`, { type: QueryTypes.SELECT });
  console.log("TRANSACTIONS:");
  console.table(pays);
  const sums = await db.query(`SELECT booking_id, SUM(CASE WHEN payment_status='paid' THEN amount_paid ELSE 0 END) as total_paid FROM transactions WHERE booking_id IN (${ids.join(',')}) GROUP BY booking_id`, { type: QueryTypes.SELECT });
  console.log("SUM_PAID:");
  console.table(sums);
}
await db.close();
