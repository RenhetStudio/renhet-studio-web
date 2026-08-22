const POSITIONS_SHEET = 'Positions';
const APPLICATIONS_SHEET = 'Applications';

function getSpreadsheet_() {
  var spreadsheetId = PropertiesService.getScriptProperties().getProperty('RENHET_SPREADSHEET_ID');
  if (!spreadsheetId) throw new Error('Missing RENHET_SPREADSHEET_ID script property');
  return SpreadsheetApp.openById(spreadsheetId);
}

function getSecret_() {
  return PropertiesService.getScriptProperties().getProperty('RENHET_CAREERS_SECRET');
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function headerIndex_(headers) {
  return headers.reduce(function (result, header, index) {
    result[String(header).trim().toLowerCase().replace(/[^a-z0-9]+/g, '_')] = index;
    return result;
  }, {});
}

function lines_(value) {
  return String(value || '').split(/\r?\n/).map(function (item) { return item.trim(); }).filter(Boolean);
}

function doGet() {
  try {
    var sheet = getSpreadsheet_().getSheetByName(POSITIONS_SHEET);
    if (!sheet) throw new Error('Missing Positions sheet');
    var values = sheet.getDataRange().getValues();
    if (values.length < 2) return json_({ positions: [] });
    var headers = headerIndex_(values.shift());
    ['status', 'slug', 'title'].forEach(function (required) {
      if (headers[required] === undefined) throw new Error('Missing Positions header: ' + required);
    });
    var positions = values.filter(function (row) {
      return String(row[headers.status] || '').trim().toLowerCase() === 'published';
    }).map(function (row) {
      return {
        slug: String(row[headers.slug] || '').trim().toLowerCase(),
        title: String(row[headers.title] || '').trim(),
        department: String(row[headers.department] || 'Game development').trim(),
        location: String(row[headers.location] || 'Remote').trim(),
        type: String(row[headers.type] || 'Flexible').trim(),
        summary: String(row[headers.summary] || '').trim(),
        responsibilities: lines_(row[headers.responsibilities]),
        requirements: lines_(row[headers.requirements]),
        niceToHave: lines_(row[headers.nice_to_have])
      };
    }).filter(function (position) {
      return position.title && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(position.slug);
    });
    return json_({ positions: positions });
  } catch (error) {
    return json_({ error: String(error && error.message || error) });
  }
}

function doPost(event) {
  try {
    var payload = JSON.parse(event.postData.contents || '{}');
    if (!payload.secret || payload.secret !== getSecret_()) return json_({ ok: false, error: 'Unauthorized' });
    var application = payload.application || {};
    var sheet = getSpreadsheet_().getSheetByName(APPLICATIONS_SHEET);
    if (!sheet) throw new Error('Missing Applications sheet');
    sheet.appendRow([
      new Date().toISOString(), application.positionId || '', application.positionTitle || '',
      application.name || '', application.email || '', application.location || '',
      application.portfolioUrl || '', application.linkedinUrl || '', application.resumeUrl || '',
      application.message || '', 'Yes', 'New'
    ]);
    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: String(error && error.message || error) });
  }
}
