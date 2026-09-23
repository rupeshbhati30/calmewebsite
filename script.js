const menuButton=document.querySelector('.menu-toggle');
const menu=document.querySelector('.nav-links');
menuButton.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');menuButton.textContent=open?'×':'☰'});
menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open menu');menuButton.textContent='☰'}));
const year=document.querySelector('#year');
if(year)year.textContent=new Date().getFullYear();
const orderForm=document.querySelector('#orderForm');
const formStatus=document.querySelector('#formStatus');
const whatsappContinue=document.querySelector('#whatsappContinue');
if(orderForm)orderForm.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!orderForm.reportValidity())return;
  const submitButton=orderForm.querySelector('[type="submit"]');
  const values=new FormData(orderForm);
  const config=window.CALME_SUPABASE_CONFIG||{};
  const projectUrl=(config.url||'').trim().replace(/\/$/,'');
  const publishableKey=(config.publishableKey||'').trim();
  if(!projectUrl||!publishableKey){formStatus.textContent='Order saving is not connected yet. Please call or WhatsApp us to place your order.';return;}
  const row={customer_name:values.get('name').trim(),phone:values.get('phone').trim(),delivery_address:values.get('address').trim(),city:values.get('city').trim(),pincode:values.get('pincode').trim(),quantity:Number.parseInt(values.get('quantity'),10),confirmation_preference:values.get('callback'),note:(values.get('message')||'').trim()||null,privacy_consent:values.get('privacyConsent')==='on'};
  const message=[`Hello Calmveda, I’d like to order Calme gummies.`,`Name: ${row.customer_name}`,`Phone: ${row.phone}`,`Delivery address: ${row.delivery_address}, ${row.city} ${row.pincode}`,`Quantity: ${values.get('quantity')}`,`Please: ${row.confirmation_preference}`,row.note?`Order note: ${row.note}`:'',`Offer shown: ₹499 per bottle (shipping and availability to be confirmed).`].filter(Boolean).join('\n');
  submitButton.disabled=true;submitButton.textContent='Saving your request…';formStatus.textContent='Saving your order request securely…';whatsappContinue.classList.remove('visible');
  try{
    const response=await fetch(`${projectUrl}/rest/v1/order_enquiries`,{method:'POST',headers:{'Content-Type':'application/json','apikey':publishableKey,'Prefer':'return=minimal'},body:JSON.stringify(row)});
    if(!response.ok)throw new Error(`Supabase returned ${response.status}`);
    whatsappContinue.href=`https://wa.me/919996756587?text=${encodeURIComponent(message)}`;
    whatsappContinue.classList.add('visible');
    formStatus.textContent='Your order request is saved. Review the WhatsApp message and tap Send so our team can call to confirm.';
    whatsappContinue.focus();
  }catch(error){
    console.error('Calme order enquiry could not be saved.',error);
    formStatus.textContent='We could not save this request. Your details have not been sent. Please try again, or contact us by WhatsApp or phone.';
  }finally{submitButton.disabled=false;submitButton.innerHTML='Save order request <span>↗</span>';}
});
