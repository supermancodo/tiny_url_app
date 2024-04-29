const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://mongo:27017/tiny-url', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: String
});

const Url = mongoose.model('Url', urlSchema);

app.post('/api/shorten', async (req, res) => {
    const { originalUrl } = req.body;
    if (!originalUrl) {
        return res.status(400).json({ error: 'Original URL is required' });
    }

    try {
        let url = await Url.findOne({ originalUrl });
        if (url) {
            res.json(url);
        } else {
            const shortCode = shortid.generate();
            const shortUrl = `${process.env.PUBLIC_BACKEND_URL}/${shortCode}`;
            const newUrl = new Url({
                originalUrl,
                shortUrl
            });
            await newUrl.save();
            res.json(newUrl);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/:shortCode', async (req, res) => {
    const { shortCode } = req.params;
    try {
        const url = await Url.findOne({ shortUrl: `${process.env.PUBLIC_BACKEND_URL}/${shortCode}` });
        if (url) {
            return res.redirect(url.originalUrl);
        } else {
            return res.status(404).json({ error: 'URL not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

app.get('/', (req, res) => {
    res.redirect(`${process.env.PUBLIC_BACKEND_URL}`);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
