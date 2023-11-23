const HTML_ENTITY_MAP = {
   '&': '&amp;',
   '<': '&lt;',
   '>': '&gt;',
   '"': '&quot;',
   "'": '&#39;',
   '/': '&#x2F;',
   '`': '&#x60;',
   '=': '&#x3D;'
 };

 const escapeHtml = (string) => {
   return String(string).replace(/[&<>"'`=\/]/g, function (s) {
     return HTML_ENTITY_MAP[s];
   });
 };

