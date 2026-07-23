// نماد اعتماد الکترونیکی (اینماد)
// نکته: کد اینماد باید عیناً همان چیزی باشد که پنل اینماد می‌دهد؛
// به‌خصوص ویژگی‌های `referrerpolicy='origin'` و `code=...` که هنگام تأیید بررسی می‌شوند.
// به همین دلیل به‌جای بازنویسی در JSX از dangerouslySetInnerHTML استفاده می‌کنیم
// تا مارک‌آپ دقیقاً دست‌نخورده بماند. از next/image هم نباید استفاده کرد
// چون آدرس logo.aspx باید مستقیم و با referrer درست به enamad.ir برود.

const ENAMAD_HTML = `<a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=7013926&Code=I3LqL0w0pAwfjpoUnMQKKarr4XBeeybC'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=7013926&Code=I3LqL0w0pAwfjpoUnMQKKarr4XBeeybC' alt='نماد اعتماد الکترونیکی سما ماساژ' style='cursor:pointer; max-width:110px; height:auto' code='I3LqL0w0pAwfjpoUnMQKKarr4XBeeybC'></a>`;

export default function EnamadSeal({ className = "" }: { className?: string }) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: ENAMAD_HTML }}
    />
  );
}
