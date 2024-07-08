import { HttpStatus, Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { CustomException } from './custom-exception';

@Injectable()
export class XlsxService {
  readExcel(file: Express.Multer.File, sheet = 1): any[] {
    const buffer = file.buffer;
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetNames = workbook.SheetNames;
    if (sheetNames.length > sheet)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Sheet number ${sheet} not found`,
      );
    console.log('sheetNames', sheetNames);
    const firstSheet = workbook.Sheets[sheetNames[sheet - 1]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: null });

    return jsonData;
  }
}
