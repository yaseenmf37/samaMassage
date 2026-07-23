// کلاینت درگاه پرداخت زرین‌پال (Payment API نسخه ۴)
// همه‌ی تماس‌ها سمت سرور انجام می‌شود.
// مستندات: https://docs.zarinpal.com/paymentGateway/
//
// مبالغ همگی به «ریال» به زرین‌پال ارسال می‌شوند (تومان × ۱۰).

// شناسه‌ی پذیرنده (کد ۳۶ کاراکتری) از پنل زرین‌پال → بخش «درگاه‌ها»
export function getMerchantId(): string {
  const id = process.env.ZARINPAL_MERCHANT_ID;
  if (!id) {
    throw new Error(
      "ZARINPAL_MERCHANT_ID تعریف نشده است. آن را در متغیرهای محیطی (Vercel) قرار دهید."
    );
  }
  return id;
}

// در حالت تست، ZARINPAL_SANDBOX=true را ست کنید.
function baseUrl(): string {
  if (process.env.ZARINPAL_BASE) return process.env.ZARINPAL_BASE;
  return process.env.ZARINPAL_SANDBOX === "true"
    ? "https://sandbox.zarinpal.com"
    : "https://payment.zarinpal.com";
}

export function startPayUrl(authority: string): string {
  return `${baseUrl()}/pg/StartPay/${authority}`;
}

interface RequestArgs {
  amountRial: number;
  callbackUrl: string;
  description: string;
  mobile?: string;
  email?: string;
}

export interface RequestResult {
  ok: boolean;
  authority?: string;
  url?: string;
  code?: number;
  message?: string;
}

// ایجاد درخواست پرداخت و دریافت authority
export async function requestPayment(
  args: RequestArgs
): Promise<RequestResult> {
  const { amountRial, callbackUrl, description, mobile, email } = args;
  try {
    const res = await fetch(`${baseUrl()}/pg/v4/payment/request.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        merchant_id: getMerchantId(),
        amount: amountRial,
        // واحد را صریح ریال اعلام می‌کنیم تا صرف‌نظر از تنظیمِ پنل، مبلغ درست کسر شود
        currency: "IRR",
        callback_url: callbackUrl,
        description,
        metadata: { mobile, email },
      }),
    });

    const json: any = await res.json().catch(() => null);
    const data = json?.data;
    // در پاسخ موفق data یک آبجکت با code=100 است؛ در خطا data آرایه‌ی خالی و errors پر است.
    if (data && !Array.isArray(data) && data.code === 100 && data.authority) {
      return {
        ok: true,
        authority: data.authority,
        url: startPayUrl(data.authority),
        code: data.code,
      };
    }
    const err = json?.errors;
    const message =
      (err && !Array.isArray(err) && err.message) ||
      (data && !Array.isArray(data) && data.message) ||
      "درخواست پرداخت ناموفق بود";
    const code =
      (err && !Array.isArray(err) && err.code) ||
      (data && !Array.isArray(data) && data.code);
    console.error("ZarinPal request failed:", JSON.stringify(json));
    return { ok: false, code, message };
  } catch (e) {
    console.error("ZarinPal request error:", e);
    return { ok: false, message: "خطا در ارتباط با درگاه پرداخت" };
  }
}

export interface VerifyResult {
  ok: boolean;
  refId?: string;
  code?: number;
  message?: string;
}

// تأیید پرداخت پس از بازگشت از درگاه
export async function verifyPayment(
  authority: string,
  amountRial: number
): Promise<VerifyResult> {
  try {
    const res = await fetch(`${baseUrl()}/pg/v4/payment/verify.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        merchant_id: getMerchantId(),
        amount: amountRial,
        authority,
      }),
    });

    const json: any = await res.json().catch(() => null);
    const data = json?.data;
    // code=100 موفق، code=101 قبلاً تأیید شده (هر دو یعنی پول دریافت شده)
    if (data && !Array.isArray(data) && (data.code === 100 || data.code === 101)) {
      return { ok: true, refId: String(data.ref_id), code: data.code };
    }
    const err = json?.errors;
    const message =
      (err && !Array.isArray(err) && err.message) ||
      (data && !Array.isArray(data) && data.message) ||
      "تأیید پرداخت ناموفق بود";
    const code =
      (err && !Array.isArray(err) && err.code) ||
      (data && !Array.isArray(data) && data.code);
    console.error("ZarinPal verify failed:", JSON.stringify(json));
    return { ok: false, code, message };
  } catch (e) {
    console.error("ZarinPal verify error:", e);
    return { ok: false, message: "خطا در تأیید پرداخت" };
  }
}
