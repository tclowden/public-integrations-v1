import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function GET(req, res) {
  try {
    const { searchParams } = req.nextUrl;
    const leadId = searchParams.get('id');

    const bodyData = {
      design: {
        external_provider_id: 'testdesign12',
        project_id: '11d26357-b4b4-4028-a63f-7da5de04e1e1',
        name: 'Needs Name',
      },
    };

    const webhookURL =
      'https://api.aurorasolar.com/v2/tenants/e877cc04-4c6e-44de-98db-d40bafedec55/designs';

    const webhookResponse = await fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer sk_prod_3ed6f1038f92819288f8309e',
      },
      body: JSON.stringify(bodyData),
    });

    if (!webhookResponse.ok) {
      const errorMessage = await webhookResponse.text();
      console.error('Failed to send webhook:', errorMessage);
      return NextResponse.json({ error: 'Failed to send webhook.' });
    }

    const responseJson = await webhookResponse.json();
    const auroraDesignId = responseJson.design.id;

    if (!auroraDesignId) {
      console.error('Error updating the database:', error.message);
      return NextResponse.json({ error: 'Failed to update the database.' });
    }

    return NextResponse.json(responseJson);
  } catch (error) {
    console.error('Error:', error.message);
    return NextResponse.json({ error: 'An error occurred.' });
  }
}
