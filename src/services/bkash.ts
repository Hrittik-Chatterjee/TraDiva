let cachedToken: string | null = null;
let tokenExpiresAt: number = 0; // timestamp in ms

export async function getGrantToken(): Promise<string> {
  const now = Date.now();
  // If we have a cached token and it has at least 5 minutes of validity left, return it
  if (cachedToken && tokenExpiresAt > now + 5 * 60 * 1000) {
    return cachedToken;
  }

  const appKey = process.env.BKASH_APP_KEY;
  const appSecret = process.env.BKASH_APP_SECRET;
  const username = process.env.BKASH_USERNAME;
  const password = process.env.BKASH_PASSWORD;
  const apiUrl = process.env.BKASH_API_URL;

  if (!appKey || !appSecret || !username || !password || !apiUrl) {
    throw new Error("bKash environment credentials are not configured.");
  }

  const response = await fetch(`${apiUrl}/tokenized/checkout/token/grant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      username: username,
      password: password,
    },
    body: JSON.stringify({
      app_key: appKey,
      app_secret: appSecret,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`bKash Grant Token failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  if (data.id_token) {
    cachedToken = data.id_token;
    // Set expiration (expires_in is typically in seconds, e.g. 3600. Fallback to 1 hour if not provided)
    const expiresIn = data.expires_in ? parseInt(data.expires_in) * 1000 : 3600 * 1000;
    tokenExpiresAt = now + expiresIn;
    return cachedToken!;
  }

  throw new Error(`bKash Grant Token response invalid: ${JSON.stringify(data)}`);
}

export async function createPayment(orderId: string, amount: number, callbackURL: string) {
  const apiUrl = process.env.BKASH_API_URL;
  const appKey = process.env.BKASH_APP_KEY;
  
  const token = await getGrantToken();

  const response = await fetch(`${apiUrl}/tokenized/checkout/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
      "X-APP-Key": appKey!,
    },
    body: JSON.stringify({
      mode: "0011",
      payerReference: "TraDivaCustomer",
      callbackURL: callbackURL,
      amount: (amount / 100).toFixed(2), // bKash expects amount in BDT format (e.g. "500.00")
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: orderId,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`bKash Create Payment failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data; // returns paymentID, bkashURL, etc.
}

export async function executePayment(paymentId: string) {
  const apiUrl = process.env.BKASH_API_URL;
  const appKey = process.env.BKASH_APP_KEY;

  const token = await getGrantToken();

  const response = await fetch(`${apiUrl}/tokenized/checkout/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
      "X-APP-Key": appKey!,
    },
    body: JSON.stringify({
      paymentID: paymentId,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`bKash Execute Payment failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data; // returns statusCode, statusMessage, trxID, amount, transactionStatus
}
