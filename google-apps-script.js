/**
 * =============================================
 * GOOGLE APPS SCRIPT - LEADS MATHEUS FISCHER
 * =============================================
 * 
 * COMO CONFIGURAR (PASSO A PASSO):
 * 
 * 1. Acesse https://sheets.google.com
 * 2. Abra sua planilha de leads (ou crie uma nova)
 * 3. Na primeira linha (cabeçalhos), coloque:
 *    A1: Data | B1: Nome | C1: WhatsApp | D1: E-mail | E1: Objetivo | F1: Mensagem | G1: Origem
 * 4. Vá em Extensões → Apps Script
 * 5. APAGUE todo o código existente
 * 6. Cole TODO este código no lugar
 * 7. Salve (Ctrl+S)
 * 8. Clique em "Implantar" → "Nova implantação"
 *    - Se já tem uma implantação, clique em "Gerenciar implantações" → edite a existente
 * 9. Tipo: "App da Web"
 * 10. Executar como: "Eu"
 * 11. Quem pode acessar: "Qualquer pessoa"
 * 12. Clique em "Implantar"
 * 13. Copie a URL gerada e cole no script.js (linha 9)
 * 
 * IMPORTANTE: Se você alterar este código, precisa criar uma NOVA implantação
 * (ou atualizar a versão na implantação existente) para as mudanças funcionarem!
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    var data;
    
    // Detecta se os dados vieram como formulário ou JSON
    if (e.parameter && e.parameter.nome) {
      // Dados vieram como campos de formulário (form POST)
      data = e.parameter;
    } else if (e.postData && e.postData.contents) {
      // Dados vieram como JSON
      data = JSON.parse(e.postData.contents);
    } else {
      throw new Error('Nenhum dado recebido');
    }
    
    // Adiciona nova linha na planilha
    sheet.appendRow([
      data.data || new Date().toLocaleString('pt-BR'),
      data.nome || '',
      data.whatsapp || '',
      data.email || '',
      data.objetivo || '',
      data.mensagem || '',
      data.origem || 'Site'
    ]);
    
    // Retorna página HTML simples (necessário para iframe)
    return HtmlService.createHtmlOutput('<html><body>OK</body></html>');
    
  } catch (error) {
    return HtmlService.createHtmlOutput('<html><body>Erro: ' + error.toString() + '</body></html>');
  }
}

function doGet(e) {
  // Se receber dados via GET (fallback)
  if (e.parameter && e.parameter.nome) {
    return doPost(e);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: 'ok', 
      message: 'API de Leads Matheus Fischer funcionando!' 
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
