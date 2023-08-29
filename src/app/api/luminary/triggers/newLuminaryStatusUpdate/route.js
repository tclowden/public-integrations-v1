import { NextResponse } from 'next/server';
import { query } from '/lib/db2';
import fetch from 'node-fetch';

export async function GET(req,res) {
  try {
    const { searchParams } = req.nextUrl;
    const leadId = searchParams.get("leadId");
    

    // Check if parameters are provided
    if (!leadId) {
      return NextResponse.json({ error: 'Missing required parameters.' });
    }
    console.log('LEAD ID', leadId)
    
    // Use parameterized query for safety
    const results = await query(
      `select 
      leads."oldId" as "oldLead",
      statuses."oldId" as "oldStatus"
      From leads
      join statuses ON statuses.id = leads."statusId"
      where leads.id = '${leadId}'`,
      [leadId] // These are the parameters for the SQL query
    );
    
    const oldLead = results[0].oldLead
    const oldStatus = results[0].oldStatus
    console.log(results[0])
    console.log('Old Lead', oldLead)
    console.log('oldstatus',oldStatus)

    //Define Webhook

   const webhookURL = 'https://us-central1-adams-website-backend.cloudfunctions.net/luminary2_statusUpdate'
   const webhookPayload = {
    oldLead: oldLead,
    oldStatus: oldStatus
   }

   const webhookResponse = await fetch(webhookURL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(webhookPayload)
   });

   if (!webhookResponse.ok) {
    console.error('Failed to send webhook:', await webhookResponse.text());
   }
  
    return NextResponse.json(webhookPayload)

  } catch (error) {
    console.error("Error updating the database:", error.message);
    return NextResponse.json({ error: 'Failed to update the database.' });
  }
}