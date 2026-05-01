const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json()); // 讓伺服器能解析手機傳來的 JSON 資料
app.use(cors());         // 允許不同裝置（手機/電腦）連線

// ----------------------------------------------------
// 1. 連接 MongoDB (請把下方的 <password> 換成你設定的資料庫密碼)
// ----------------------------------------------------
const mongoURI = "mongodb+srv://eric0990318_db_user:fEcexVRx9yvJbvtB@cluster0.5q9s01s.mongodb.net/?appName=Cluster0"; 

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB 連線成功！資料同步中心已就緒"))
  .catch(err => console.error("❌ MongoDB 連線失敗:", err));

// ----------------------------------------------------
// 2. 定義資料結構 (Schema)
// ----------------------------------------------------
const scoutSchema = new mongoose.Schema({
  match: Number,
  team: Number,     
  scout: String,
  ts: { type: Number, default: Date.now }
});
const Scout = mongoose.model('Scout', scoutSchema);

// ----------------------------------------------------
// 3. 設定路由 (Routes)
// ----------------------------------------------------

// 取得所有資料 (給電腦總覽用)
app.get('/api/data', async (req, res) => {
  const data = await Scout.find().sort({ ts: -1 });
  res.json(data);
});

// 儲存新資料 (給手機傳送用)
app.post('/api/data', async (req, res) => {
  try {
    const newData = new Scout(req.body);
    await newData.save();
    res.status(201).json({ message: "儲存成功" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 4. 啟動伺服器
// ----------------------------------------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 伺服器正在執行中：http://localhost:${PORT}`);
});