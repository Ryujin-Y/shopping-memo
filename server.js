const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// メモを保存する配列（本来はデータベースを使用すべき）
let memos = [];

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// メモ一覧を取得するAPI
app.get('/api/memos', (req, res) => {
    res.json(memos);
});

// メモを追加するAPI
app.post('/api/memos', (req, res) => {
    const { text, user } = req.body;
    const newMemo = { text, user };
    memos.push(newMemo);
    res.json(newMemo);
});

// メモを削除するAPI
app.delete('/api/memos/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= 0 && index < memos.length) {
        memos.splice(index, 1);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'メモが見つかりません' });
    }
});

app.listen(port, () => {
    console.log(`サーバーが起動しました: http://localhost:${port}`);
}); 