const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Ma'lumotlar bazasi o'rnida server xotirasini ishlatamiz
let products = [];
let orders = [];

// --- MAHSULOTLAR (PRODUCTS) UCHUN API ---
app.get("/api/products", (req, res) => res.json(products));

app.post("/api/products", (req, res) => {
    const newProduct = req.body;
    products.push(newProduct);
    res.json(newProduct);
});

app.delete("/api/products/:id", (req, res) => {
    products = products.filter(p => String(p.id) !== String(req.params.id));
    res.json({ success: true });
});

// Mahsulotni tahrirlash (Edit)
app.put("/api/products/:id", (req, res) => {
    const id = req.params.id;
    let found = false;
    products = products.map(p => {
        if (String(p.id) === String(id)) {
            found = true;
            return { ...p, ...req.body, id: p.id };
        }
        return p;
    });
    if (!found) products.push({ ...req.body, id: isNaN(id) ? id : Number(id) });
    res.json({ success: true });
});

// --- BUYURTMALAR (ORDERS) UCHUN API ---
app.get("/api/orders", (req, res) => res.json(orders));

app.post("/api/orders", (req, res) => {
    const newOrder = req.body;
    orders.unshift(newOrder); // Yangi buyurtmani tepaga joylaymiz
    res.json(newOrder);
});

app.put("/api/orders/:id", (req, res) => {
    orders = orders.map(o => o.id === req.params.id ? { ...o, status: req.body.status } : o);
    res.json({ success: true });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend server http://localhost:${PORT} portida ishga tushdi!`));