import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parse as json2csv } from 'json2csv';
import { parse as js2xml } from 'js2xmlparser';
import YAML from 'yaml';

export const dynamic = 'force-dynamic';
const ALLOWED_FORMATS = ['json', 'csv', 'xml', 'yml', 'yaml'];

export async function GET(req: Request, { params }: { params: Promise<{ appSegment: string, tableName: string }> }) {
  try {
    const rawParams = await params;
    const format = decodeURIComponent(rawParams.appSegment).toLowerCase();
    const tableName = decodeURIComponent(rawParams.tableName);
    
    if (!ALLOWED_FORMATS.includes(format)) {
        return new NextResponse(`Format [${format}] is not supported. Try csv, json, xml, or yml.`, { status: 400 });
    }

    const row = await db.getSheet(tableName);
    if (!row) return new NextResponse(`Table [${tableName}] not found.`, { status: 404 });

    const jsonData = JSON.parse(row.data);
    
    switch (format.toLowerCase()) {
      case 'json': return NextResponse.json(jsonData);
      case 'csv': return new NextResponse(json2csv(jsonData), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${tableName}.csv"` } });
      case 'xml': return new NextResponse(js2xml("data", { row: jsonData }), { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Content-Disposition': `attachment; filename="${tableName}.xml"` } });
      case 'yml':
      case 'yaml': return new NextResponse(YAML.stringify(jsonData), { headers: { 'Content-Type': 'application/x-yaml; charset=utf-8', 'Content-Disposition': `attachment; filename="${tableName}.yml"` } });
      default: return NextResponse.json(jsonData);
    }
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
