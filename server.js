const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const SECRET_KEY = 'your-very-secure-secret';
const upload = multer({ dest: 'uploads/' });

// پاشەکەوتکردنی پەڕگەکان بە ناوی ڕەسەن
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileUpload = multer({ storage: storage });

// Authentication Middleware
const authenticate = (req, res, next) => {
    const token = req.headers.authorization ? .split(' ')[1];
    if (!token) return res.redirect('/language.html');

    try {
        req.user = jwt.verify(token, SECRET_KEY);
        next();
    } catch (err) {
        res.redirect('/language.html');
    }
};

// Create (POST) - پشتگیری هەموو جۆرە پەڕگەیەک
app.post('/:type(projects|reports)', fileUpload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'files', maxCount: 5 }
]), authenticate, async(req, res) => {
    try {
        const { type } = req.params;
        const files = req.files;

        const metadata = {
            title_ku: req.body.title_ku,
            shortDescription_ku: req.body.shortDescription_ku,
            description_ku: req.body.description_ku,
            title_en: req.body.title_en,
            shortDescription_en: req.body.shortDescription_en,
            description_en: req.body.description_en,
            image: files.image ? .[0].filename,
            video: files.video ? .[0].filename,
            files: files.files ? .map(f => f.filename) || [],
            date: new Date().toISOString()
        };

        const dbPath = path.join(__dirname, 'database/db.json');
        const db = JSON.parse(fs.readFileSync(dbPath));
        db[type].push({ id: Date.now(), ...metadata });
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        res.json({ success: true, data: metadata });
    } catch (error) {
        res.status(500).json({ error: 'هەڵەی نێوەخۆیی سێرڤەر' });
    }
});

// ڕێڕەوی نوێ بۆ language.html
app.get('/language.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/language.html'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.redirect('/language.html');
});

app.listen(3001, () => console.log('سێرڤەر کاردەکات لە پۆرتی 3001 🚀'));