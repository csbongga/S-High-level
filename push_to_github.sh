#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 กำลัง Push ขึ้น GitHub: https://github.com/csbongga/S-High-level ..."
git branch -M main
git push -u origin main
echo ""
echo "🎉 สำเร็จเรียบร้อย! สามารถเข้าไปเปิด GitHub Pages ได้ที่ Settings -> Pages ของ Repository ครับ"
