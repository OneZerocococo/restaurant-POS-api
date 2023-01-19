# restaurant POS API

本專案提供API給[restaurant POS API](https://github.com/JamieLoLo/POS-system)使用。

## 產品功能

### POS系統
- 開桌設定用餐人數
- 設定低消
- 新增、編輯餐點
- 點餐
- 結帳
- 關帳
- 查看銷售排行、營收報表

### 顧客點餐系統
- 查看餐點
- 點餐

## 安裝流程
此安裝流程為本地端(local)使用。

### 專案建立
請先確認有安裝 node.js 與 npm

1. 打開你的終端機(terminal)，Clone 此專案至本機電腦

```
git clone https://github.com/OneZerocococo/restaurant-POS-api.git
```

2. 進入至專案資料夾

```
cd restaurant-POS-api
```

3. 安裝 npm 相關套件

```
npm install
```

4. 新增 .env
為了確保使用順利，請新增.env檔，並按照.env.example檔設定
```
JWT_SECRET=SKIP
IMGUR_CLIENT_ID=SKIP
```

5. 建立MySQL資料庫
請打開MySQL Workbench，並在登入後，新增SQL File後，於內文輸入

```
drop database if exists restaurant_pos_dev;
create database restaurant_pos_dev;
```

即建立restaurant_pos_dev。

6. 建立資料庫table

```
npx sequelize db:migrate
```

7. 載入種子資料

```
npx sequelize db:seed:all
```

8. 啟動專案

```
node app.js
```

10. 當終端機(terminal)出現以下字樣，代表執行成功

```
App is running on http://localhost:3000
```

## API文件
[API文件](https://pinnate-dugong-ab6.notion.site/API-d4086a81fae248beb65a553435e6342d)

## 開發人員
[OneZero](https://github.com/OneZerocococo)