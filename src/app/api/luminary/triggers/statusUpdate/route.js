import { NextResponse } from 'next/server';
import { query } from '/lib/db2';

export async function POST(req) {
  try {
    const { searchParams } = req.nextUrl;
    const leadId = searchParams.get("lead_id");
    const statusId = searchParams.get("status");

    // Check if parameters are provided
    if (!leadId || !statusId) {
      return NextResponse.json({ error: 'Missing required parameters.' });
    }
    console.log('LEAD ID', leadId)
    console.log('STATUS id', statusId)
    // Use parameterized query for safety
    const results = await query(
      `UPDATE leads 
      SET "statusId" = 
        (SELECT id 
         FROM statuses 
         WHERE "oldId" = $1 
         LIMIT 1)
      WHERE leads."oldId" = $2`,
      [statusId, leadId] // These are the parameters for the SQL query
    );
    console.log('test')
    console.log("Update Successfull");
    return NextResponse.json("Update Successfull")

  } catch (error) {
    console.error("Error updating the database:", error.message);
    return NextResponse.json({ error: 'Failed to update the database.' });
  }
}
