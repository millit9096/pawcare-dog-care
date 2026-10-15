import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const KEY = 'pawcare-reminders-v1';
const labels = { vaccination: 'टीकाकरण', deworming: 'डीवॉर्मिंग', checkup: 'वेट जाँच', other: 'अन्य' };
const app = document.querySelector('#app');

function readReminders() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

function reminderCard() {
  if (!app.querySelector('[data-pawcare-reminders]')) {
    const tile = document.createElement('button');
    tile.className = 'tile';
    tile.dataset.pawcareReminders = '';
    tile.innerHTML = '<span class="icon">🔔</span><b>मेरे रिमाइंडर</b><small>टीके, डीवॉर्मिंग और जाँच याद रखें</small>';
    tile.addEventListener('click', showReminders);
    app.querySelector('.quick')?.append(tile);
  }
}

function showReminders() {
  const native = Capacitor.isNativePlatform();
  app.innerHTML = `<button class="back" id="remindersBack">← सभी विषय</button>
    <h2 class="page-title">🔔 मेरे रिमाइंडर</h2>
    <div class="callout">रिमाइंडर अपने फोन पर सुरक्षित रहते हैं। यह तारीख़ की याद दिलाता है; दवा या टीके का समय पशु-चिकित्सक से तय करें।</div>
    <article class="content-card">
      <h3>नया रिमाइंडर</h3>
      <form id="reminderForm">
        <label>कुत्ते का नाम <input name="pet" maxlength="40" required placeholder="जैसे: मोती"></label>
        <label>किस बात के लिए <select name="kind"><option value="vaccination">टीकाकरण</option><option value="deworming">डीवॉर्मिंग</option><option value="checkup">वेट जाँच</option><option value="other">अन्य</option></select></label>
        <label>तारीख़ और समय <input name="when" type="datetime-local" required></label>
        <label>नोट (वैकल्पिक) <input name="note" maxlength="100" placeholder="जैसे: क्लिनिक का नाम"></label>
        <button type="submit" style="margin:12px 0 18px;padding:12px 16px;border:0;border-radius:12px;background:#246a55;color:white;font-weight:700">रिमाइंडर सेव करें</button>
      </form>
      <h3>सेव किए रिमाइंडर</h3>
      <div id="reminderList"></div>
    </article>
    <div class="callout">${native ? 'सूचनाएँ चालू करने पर PawCare नियत समय पर फोन में सूचना दिखाएगा।' : 'ब्राउज़र संस्करण में सूची सेव होगी। फोन पर सूचना पाने के लिए store app में notification अनुमति चालू करें।'}</div>`;
  document.querySelector('#remindersBack').onclick = () => location.reload();
  const dateInput = app.querySelector('[name="when"]');
  const now = new Date(Date.now() + 60 * 60 * 1000);
  dateInput.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  dateInput.value = new Date(now.getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  renderList();
  app.querySelector('#reminderForm').addEventListener('submit', saveReminder);
}

function renderList() {
  const list = app.querySelector('#reminderList');
  if (!list) return;
  const reminders = readReminders().sort((a, b) => a.when.localeCompare(b.when));
  if (!reminders.length) { list.innerHTML = '<p>अभी कोई रिमाइंडर नहीं है।</p>'; return; }
  list.innerHTML = reminders.map(item => `<div style="border-top:1px solid #e1e9e2;padding:12px 0"><strong>${escapeText(item.pet)} · ${labels[item.kind] || labels.other}</strong><p style="margin:2px 0">${new Date(item.when).toLocaleString('hi-IN')}${item.note ? ` · ${escapeText(item.note)}` : ''}</p><button data-remove="${item.id}" type="button">हटाएँ</button></div>`).join('');
  list.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', () => removeReminder(Number(button.dataset.remove))));
}

function escapeText(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

async function saveReminder(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const when = new Date(String(form.get('when')));
  if (!Number.isFinite(when.getTime()) || when <= new Date()) { alert('भविष्य की तारीख़ और समय चुनें।'); return; }
  const reminders = readReminders();
  const id = Date.now() % 2147483647;
  const reminder = { id, pet: String(form.get('pet')).trim(), kind: String(form.get('kind')), when: when.toISOString(), note: String(form.get('note') || '').trim() };
  if (Capacitor.isNativePlatform()) {
    let permission = await LocalNotifications.checkPermissions();
    if (permission.display !== 'granted') permission = await LocalNotifications.requestPermissions();
    if (permission.display !== 'granted') { alert('रिमाइंडर सेव करने के लिए सूचना की अनुमति चालू करें।'); return; }
    await LocalNotifications.schedule({ notifications: [{ id, title: `PawCare: ${labels[reminder.kind]}`, body: `${reminder.pet} के लिए रिमाइंडर${reminder.note ? ` — ${reminder.note}` : ''}`, schedule: { at: when } }] });
  }
  localStorage.setItem(KEY, JSON.stringify([...reminders, reminder]));
  renderList();
  event.currentTarget.reset();
}

async function removeReminder(id) {
  if (Capacitor.isNativePlatform()) await LocalNotifications.cancel({ notifications: [{ id }] });
  localStorage.setItem(KEY, JSON.stringify(readReminders().filter(item => item.id !== id)));
  renderList();
}

new MutationObserver(reminderCard).observe(app, { childList: true, subtree: true });
reminderCard();

