const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 创建上传目录
const UPLOAD_FOLDER = './public/i';
if (!fs.existsSync(UPLOAD_FOLDER)) {
    fs.mkdirSync(UPLOAD_FOLDER);
}

// 初始化 Express
const app = express();

// 配置 multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_FOLDER); // 设置上传目录
    },
    filename: (req, file, cb) => {
        // 获取当前时间戳（缓存一次）
        const timestamp = Date.now();
        // 提取文件扩展名（包括多段后缀）
        const fileExtension = path.extname(file.originalname);
        // 构造文件名
        const filename = `${timestamp}${fileExtension}`;
        // 将时间戳存入请求对象，方便复用
        req.outputFilename = filename;
        cb(null, filename);
    }
});

const upload = multer({ storage });

// 文件上传接口
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // 使用缓存的时间戳
    res.json({
        outputFilename: req.outputFilename
    });
});

// 启动服务
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
