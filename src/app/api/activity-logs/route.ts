import { NextRequest } from 'next/server';
import { apiSuccess } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  return apiSuccess([]);
}
