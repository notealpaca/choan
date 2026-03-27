/**
 * 長安 お問い合わせフォーム受信用スクリプト
 * 
 * 使い方:
 * 1. Google スプレッドシートを新規作成する
 * 2. 拡張機能 > Apps Script を開く
 * 3. このコードを貼り付ける
 * 4. 「通知先メールアドレス」を山川様のアドレス等に書き換える
 * 5. デプロイ > 新しいデプロイ > 種類: ウェブアプリ
 *    - 説明: 長安お問い合わせフォーム
 *    - 実行ユーザー: 自分
 *    - アクセスできるユーザー: 全員
 * 6. 発行された「ウェブアプリのURL」を inquiry.html に貼り付ける
 */

const NOTIFICATION_EMAIL = "info@choan2023.com"; // 通知先メールアドレス 

function doPost(e) {
  try {
    const params = e.parameter;
    
    // スプレッドシートへの記録
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const timestamp = new Date();
    
    sheet.appendRow([
      timestamp,
      params.name,
      params.company,
      params.email,
      "'" + params.tel,
      params.reply,
      params.source,
      params.message
    ]);
    
    // メール通知
    const subject = "【長安】Webサイトからのお問い合わせ（" + params.name + "様）";
    const body = `
Webサイトから新しいお問い合わせが届きました。

【送信日時】: ${timestamp}
【氏名】: ${params.name}
【会社名】: ${params.company || "未記入"}
【メールアドレス】: ${params.email}
【電話番号】: ${params.tel}
【返信の希望】: ${params.reply}
【認知経路】: ${params.source || "未記入"}

【メッセージ内容】:
${params.message}

---
スプレッドシートで確認する:
${SpreadsheetApp.getActiveSpreadsheet().getUrl()}
`;
    
    GmailApp.sendEmail(NOTIFICATION_EMAIL, subject, body, {
      name: "長安問合せフォーム"
    });
    
    // 成功レスポンス（CORS対応）
    return ContentService.createTextOutput(JSON.stringify({
      "result": "success"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "result": "error",
      "error": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
