// Utility functions for exporting form responses to different formats

export interface ExportOptions {
  filename: string
  format: 'csv' | 'excel' | 'json'
  includeTimestamp: boolean
}

export function exportToCSV(
  data: Array<Record<string, any>>,
  filename: string = 'export.csv'
): void {
  if (data.length === 0) return

  // Get all unique keys from data
  const keys = Array.from(new Set(data.flatMap(obj => Object.keys(obj))))

  // Create header row
  const headers = keys.join(',')

  // Create data rows
  const rows = data.map(obj =>
    keys.map(key => {
      const value = obj[key]
      // Handle CSV escaping
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return `"${value || ''}"`
    }).join(',')
  )

  const csvContent = [headers, ...rows].join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToExcel(
  data: Array<Record<string, any>>,
  filename: string = 'export.xlsx'
): void {
  if (data.length === 0) return

  // Get all unique keys from data
  const keys = Array.from(new Set(data.flatMap(obj => Object.keys(obj))))

  // Create header row
  const headers = keys.join('\t')

  // Create data rows
  const rows = data.map(obj =>
    keys.map(key => obj[key] || '').join('\t')
  )

  const excelContent = [headers, ...rows].join('\n')

  // Create blob and download
  const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToJSON(
  data: Array<Record<string, any>>,
  filename: string = 'export.json'
): void {
  if (data.length === 0) return

  const jsonContent = JSON.stringify(data, null, 2)

  // Create blob and download
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToGoogleSheets(
  data: Array<Record<string, any>>,
  spreadsheetName: string = 'Form Responses'
): void {
  if (data.length === 0) return

  // Convert data to CSV format
  const keys = Array.from(new Set(data.flatMap(obj => Object.keys(obj))))
  const headers = keys.join(',')
  const rows = data.map(obj =>
    keys.map(key => {
      const value = obj[key]
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return `"${value || ''}"`
    }).join(',')
  )

  const csvContent = [headers, ...rows].join('\n')

  // Create a link that redirects to Google Sheets import
  // Note: This is a placeholder. For production, use Google Sheets API
  console.log('To export to Google Sheets, use Google Sheets API integration')
  console.log('CSV data ready:', csvContent)

  // For now, we'll export to CSV as a fallback
  exportToCSV(data, `${spreadsheetName}-${Date.now()}.csv`)
}

export async function exportWithOptions(
  data: Array<Record<string, any>>,
  options: Partial<ExportOptions> = {}
): Promise<void> {
  const {
    format = 'csv',
    filename = `export-${Date.now()}`,
    includeTimestamp = true,
  } = options

  let finalData = data

  if (includeTimestamp) {
    finalData = data.map(item => ({
      ...item,
      exportedAt: new Date().toISOString(),
    }))
  }

  switch (format) {
    case 'csv':
      exportToCSV(finalData, `${filename}.csv`)
      break
    case 'excel':
      exportToExcel(finalData, `${filename}.xlsx`)
      break
    case 'json':
      exportToJSON(finalData, `${filename}.json`)
      break
    default:
      exportToCSV(finalData, `${filename}.csv`)
  }
}
