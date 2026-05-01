const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'site-data.json');

const defaultSiteData = {
  categories: [
    { id: 'rings', title: 'خواتم | Rings', description: 'تصاميم مميزة لكل الأذواق.', image: 'images/rings.jpg' },
    { id: 'earrings', title: 'حلقان | Earrings', description: 'لمسات ناعمة وأنيقة للمناسبات.', image: 'images/earrings.jpg' },
    { id: 'bracelets', title: 'أساور | Bracelet', description: 'قطع أنيقة لإطلالة يومية راقية.', image: 'images/bracelets.jpg' },
    { id: 'chains', title: 'سلاسل | Chains', description: 'سلاسل بتصاميم عصرية وكلاسيك.', image: 'images/chains.jpg' },
    { id: 'watches', title: 'ساعات | Watches', description: 'ساعات أنيقة ومميزة لكل يوم.', image: 'images/watches.jpg' },
    { id: 'hand-chain', title: 'سلسلة يد | Hand Chain', description: 'تفاصيل صغيرة تحوّل إطلالتك.', image: 'images/hand-chain.jpg' }
  ],
  products: [
    { id: 'ring-1', category: 'rings', title: 'خاتم وردي لامع', description: 'خاتم بسيط مع لمسة أنثوية مثالية لكل يوم.', price: '280 جنيه', image: 'images/rings.jpg' },
    { id: 'ring-2', category: 'rings', title: 'خاتم حجر روز', description: 'تصميم ناعم يجمع بين الكلاسيكي والعصري.', price: '320 جنيه', image: 'images/rings.jpg' },
    { id: 'earring-1', category: 'earrings', title: 'حلق بلون الماس', description: 'لمسة براقة تناسب السهرات والمناسبات.', price: '210 جنيه', image: 'images/earrings.jpg' },
    { id: 'earring-2', category: 'earrings', title: 'حلق دائري ناعم', description: 'تصميم بسيط يمنحك مظهرًا أنيقًا يوميًا.', price: '170 جنيه', image: 'images/earrings.jpg' },
    { id: 'bracelet-1', category: 'bracelets', title: 'سوار لؤلؤ', description: 'سوار أنثوي بسيط مع لمسات لؤلؤ جميلة.', price: '240 جنيه', image: 'images/bracelets.jpg' },
    { id: 'bracelet-2', category: 'bracelets', title: 'سوار جلد معدني', description: 'قطعة جريئة تضيف شخصية لإطلالتك.', price: '260 جنيه', image: 'images/bracelets.jpg' },
    { id: 'chain-1', category: 'chains', title: 'سلسلة قلب', description: 'سلسلة رومانسية تناسب الهدايا الخاصة.', price: '290 جنيه', image: 'images/chains.jpg' },
    { id: 'chain-2', category: 'chains', title: 'سلسلة رفيعة', description: 'تصميم بسيط يكمل إطلالتك اليومية.', price: '230 جنيه', image: 'images/chains.jpg' },
    { id: 'watch-1', category: 'watches', title: 'ساعة جلد فاخرة', description: 'ساعة أنيقة تصلح للعمل والمناسبات.', price: '420 جنيه', image: 'images/watches.jpg' },
    { id: 'watch-2', category: 'watches', title: 'ساعة رقمية مودرن', description: 'تصميم شبابي عملي مع لمسة عصرية.', price: '380 جنيه', image: 'images/watches.jpg' },
    { id: 'hand-chain-1', category: 'hand-chain', title: 'سلسلة يد كريستال', description: 'تفاصيل فاخرة تضيف لمسة أنثوية.', price: '270 جنيه', image: 'images/hand-chain.jpg' },
    { id: 'hand-chain-2', category: 'hand-chain', title: 'سلسلة يد ذهبي', description: 'قطعة تجذب الأنظار بجمالها الهادئ.', price: '310 جنيه', image: 'images/hand-chain.jpg' }
  ]
};

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

async function ensureDataFile() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.access(dataFile);
  } catch (error) {
    await fs.writeFile(dataFile, JSON.stringify(defaultSiteData, null, 2), 'utf8');
  }
}

async function readSiteData() {
  try {
    await ensureDataFile();
    const content = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return defaultSiteData;
  }
}

async function writeSiteData(data) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf8');
}

app.get('/api/site-data', async (req, res) => {
  const data = await readSiteData();
  res.json(data);
});

app.post('/api/site-data', async (req, res) => {
  const data = req.body;
  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: 'Invalid site data.' });
  }

  await writeSiteData(data);
  res.json({ success: true });
});

app.post('/api/reset', async (req, res) => {
  await writeSiteData(defaultSiteData);
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`B.Accessories backend running at http://localhost:${port}`);
});
